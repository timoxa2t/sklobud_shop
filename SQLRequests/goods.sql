SELECT id, name, description, price, isGroup, groupName, imageGuid
FROM Nomenclature
WHERE type="goods"
;
SELECT productId, name, value
FROM Params
  INNER JOIN ProductParams
  ON Params.id = ProductParams.paramId
