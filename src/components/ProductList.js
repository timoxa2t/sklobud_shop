
import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Product from './Product'
// import styled from "styled-components"
import {ButtonGroup, ToggleButton, Dropdown, Button, Offcanvas} from 'react-bootstrap';
import { sortProducts } from '../store/actions/product';

const getFilters = (products) => {
  return products.reduce((acc, item) => {
    const params = Object.entries(item.params)
    params.map(param => {
      if(param[0] === "" || param[1] === "") return acc
      if(acc.hasOwnProperty(param[0])){
        acc[param[0]].add(param[1])
      }else{
        acc[param[0]] = new Set()
        acc[param[0]].add(param[1])
      }
      return acc
    })
    return acc
  }, { "Клас": new Set(), "Марка": new Set()})
}

export default function ProductList() {
  const dispatch = useDispatch()
  const [refresh, setRefresh] = useState(false)
  const products = useSelector(store => store.product.products)

  const classMarkCorelation = products.reduce((acc, item) => {
    if(item.params.hasOwnProperty("Клас")){
      acc.set(item.params["Клас"], item.params["Марка"])
    }
    return acc
  }, new Map())
 
  const [filters, setFilters] = useState(getFilters(products))
  const [selectedFilters, setSelectedFilters] = useState({})
  const sortList = [
    "Від дешевих до дорогих",
    "Від дорогих до дешевих",
  ]
  const [sortBy, setSortBy] = useState(sortList[0])
  const [showSidebar, setShowSidebar] = useState(false);

  const getfilteredFilters = (filteredProducts) => {

    const filterKeys = Object.keys(selectedFilters)
    let filteredFilters = {}
    Object.assign(filteredFilters, filters)
    const mainFilteredFilters = getFilters(filteredProducts)
    filterKeys.map(filteredKey => {
      const subproducts = products.filter(item => {
        if(!item.params.hasOwnProperty(filteredKey)) return item.isGroup
        return selectedFilters[filteredKey].some(selctFiltr => item.params[filteredKey] === selctFiltr)
      })
      const subfilters = getFilters(subproducts)
      return Object.keys(filteredFilters).map(key => {
        if(key === filteredKey
            || (key === "Марка" && filteredKey === "Клас")
            || (key === "Клас" && filteredKey === "Марка")){
          return false
        }
        if(!mainFilteredFilters.hasOwnProperty(key)) {
          delete filteredFilters[key]
          return false
        }
        filteredFilters[key] = new Set([...filteredFilters[key]].filter(item => {
            return [...subfilters[key]].some(subitem => {
              return subitem === item
            })
          })
        )
        return filteredFilters
      })
    })

    return filteredFilters
  }
  const size = useWindowSize()

  const filteredProducts = products.filter(item => {
    const filterKeys = Object.keys(selectedFilters)

    return filterKeys.reduce((acc, key) => {
      if(!item.params.hasOwnProperty(key)) return item.isGroup
      return acc && selectedFilters[key].some(selctFiltr => item.params[key] === selctFiltr)
    }, true)
  })

  const filteredFilters = filteredProducts.reduce((acc, item) => item.isGroup ? acc: ++acc, 0) > 0 ? getfilteredFilters(filteredProducts): filters

  const handleFilterChange = (target) => {

    const {id, checked} = target

    const deleteFilter = (key, index) => {
      selectedFilters[key].splice(index, 1)
      if(selectedFilters[key].length === 0){
          delete selectedFilters[key]
      }
    }

    const filterCategory = Object.keys(filters).find(key => filters[key].has(id));
    if(checked) {
      if(! Object.keys(selectedFilters).find(key => key === filterCategory)){
        selectedFilters[filterCategory] = []
      }
      if(filterCategory === "Клас"){
          if(!selectedFilters.hasOwnProperty("Марка")) selectedFilters["Марка"] = []
          selectedFilters["Марка"].push(classMarkCorelation.get(id))
      }else if(filterCategory === "Марка"){
          classMarkCorelation.forEach((value, key) => {
            if (value === id){
              if(!selectedFilters.hasOwnProperty("Клас")) selectedFilters["Клас"] = []
              selectedFilters["Клас"].push(key)
            }
          })
      }
      selectedFilters[filterCategory].push(id)
    }else{
      const index = selectedFilters[filterCategory].findIndex(item => item === id)
      if(filterCategory === "Клас"){
        deleteFilter("Марка", index)
      }else if(filterCategory === "Марка"){
        deleteFilter("Клас", index)
      }
      deleteFilter(filterCategory, index)
    }
    setSelectedFilters(selectedFilters)
    setRefresh(!refresh)
  }

  const getFilterComponents = (filtersToDisplay) => {
    if(!filtersToDisplay) return
    const rows = []
    Object.keys(filtersToDisplay).map(key =>
      rows.push(
        <ButtonGroup vertical={size.width < 900} aria-label={key} key={key} id={key}>
          <div className="badge bg-secondary text-wrap medium-text">{key}</div>
          {(() => {
            const subArr = []
            const arrFromSet = [...filtersToDisplay[key]]
            arrFromSet.sort((a, b) => {
              let index = a.lastIndexOf('-');
              index = index === -1 ? 0: index
              const numOne = parseFloat(a.substring(index + 1))
              index = b.lastIndexOf('-');
              index = index === -1 ? 0: index
              const numTwo = parseFloat(b.substring(index + 1))
              return numOne - numTwo
            })
            arrFromSet.forEach(item => {
              const checked = isFilterChecked(key, item)
              const btnVariant = (checked ? "secondary": "outline-secondary")
              subArr.push(
              <ToggleButton
                key={item}
                id={item}
                type="checkbox"
                variant={btnVariant}
                value={checked}
                checked={checked}
                onChange={(e) => handleFilterChange(e.target)}
              >
                <div className="current-text-color">{item}</div>
              </ToggleButton>
            )})
            return subArr
          })()}
        </ButtonGroup>)
    )
    return size.width < 900 ? (
      <>
        <Button variant="outline-secondary" onClick={() => setShowSidebar(true)}>
          Відбір
        </Button>
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="p-2 w-75">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Відбір</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="row gap-1">
            {rows}
          </Offcanvas.Body>
        </Offcanvas>
      </>):
      rows
  }

  const isFilterChecked = (key, value) =>{
    return selectedFilters.hasOwnProperty(key) ? selectedFilters[key].some(filter => value === filter) : false
  }


  useEffect(() => {
    setFilters(getFilters(products))
  }, [products])

  useEffect(() => {
    dispatch(sortProducts(sortBy))
  }, [sortBy, dispatch])

  return (
    <React.Fragment>
      <div className="py-5">
        <div className="container">
          <div className="row gap-1">
            {getFilterComponents(filteredFilters)}
          </div>
          <div className="gap-1 p-1">
            <Dropdown onSelect={(key) => {setSortBy(key)}} as={ButtonGroup} className="">

              <Dropdown.Toggle variant="outline-secondary" id="bg-sort-by">
                {sortBy}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {sortList.map(key =>
                  <Dropdown.Item key={key} eventKey={key}>{key}</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="row">
            {filteredProducts.map((item) => (<Product key={parseInt(item.id)} details={item}/>))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function useWindowSize() {

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

// const categorizeProducts = (selectedProducts) => {
//   const categories = selectedProducts.filter(item => item.isGroup)
//   return categories.map(category => {
//     const categoryItems = selectedProducts.filter(item => item.groupName === category.name)
//     return categoryItems.length == 0 ? null:
//     (<Category key={category.name}>
//       {category.name}
//       <div className="container">
//         <div className="row">
//           {categoryItems.map(item => (
//             <Product key={parseInt(item.id)} details={item}/>
//           ))}
//         </div>
//       </div>
//     </Category>)
//   })
// }

// const Category = styled.div`
//   background: rgba(0,0,0,0.1);
//   border-radius: 2vmin;
//   margin: 2vmin;
//   padding: 1vmin;
// `
