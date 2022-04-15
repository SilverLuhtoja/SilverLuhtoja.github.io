export const getName = `
        query Authentication($Id: Int){
            user(where: { id: { _eq: $Id }}) 
            {
                id
                login
            }
        }
`;

// distinct_on: objectId
export const getTransactions = `
query Transactions($offset: Int, $Id : Int, $path: String) {
    transaction(
        where: {
            userId: { _eq: $Id }
            type: { _eq: "xp" }
            path: { _iregex: $path }
        }
        offset: $offset
                ) {
                type
                createdAt
                amount
                path
                object {
                  type
                   name
                }
                
            }
        }
`;



export const getAudits = `
query Transactions($offset: Int, $Id : Int, $path: String, $type: String) {
    transaction(
        where: {
            userId: { _eq: $Id }
            type: { _eq: $type }
            path: { _iregex: $path }
        }
                offset: $offset
                ) {
                type
                createdAt
                amount
                path
                object {
                   name
                }
                
            }
        }
`;



export const getSkills = `
   query getSkills($Id: Int, $offset: Int) {
      transaction(
        where: {user: {id: {_eq: $Id}}, type: {_nin: ["xp", "up", "down"]}}
        order_by: {createdAt: desc}
        offset: $offset
      ) {
        amount
        type
      }
    }
`;


export const OnlyDivPart = `
  query($Id: Int){ progress 
    (where: { 
      userId: { _eq: $Id }
      _and: [
        {grade: {_neq: NaN}},
        {grade: {_neq: 0}}
      ]
      _or: [
      {object: {type: {_eq: "project"}}},
      {object: {type: {_eq: "piscine"}}}
      ]
    })
    {
      objectId
      createdAt
      object {
        type
        name
      }
    }
  }`;

export const pointsRequestByObjectID = `
query($objectId: Int,$Id :  Int){ 
  transaction(
      where: {
        userId: { _eq: $Id }
				objectId: {_eq: $objectId}
      }
    ) {
	    amount
      path
      type
      createdAt
      object {
        name
      }
    }
  }
`;