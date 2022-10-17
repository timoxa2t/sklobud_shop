SELECT id, name, description, price, isGroup, groupName, imageGuid
FROM Nomenclature
WHERE price > 0 and type="products"
;
SELECT productId, name, value
FROM Params
  INNER JOIN ProductParams
  ON Params.id = ProductParams.paramId
