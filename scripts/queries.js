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
                   name
                }
                
            }
        }
`;


export const getXp = `
query getXp($Id: Int, $offset: Int) {
  transaction(
    where: {userId: {_eq: $Id}, type: {_in: ["xp", "up", "down"]}, _and: [{path: {_iregex: "/johvi/div-01/"}}, {path: {_nregex: "/johvi/div-01/piscine-js"}}, {path: {_nregex: "/johvi/piscine-go"}}]}
    offset: $offset
    order_by: {objectId: asc}
  ) {
    amount
    path
    createdAt
    type
    object {
      id
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
