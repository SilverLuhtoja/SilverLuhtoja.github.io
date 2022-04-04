export let getName = `
        query Authentication($Id: Int){
            user(where: { id: { _eq: $Id }}) 
            {
                id
                login
            }
        }
`;
export let getTransactions = `
        query Transactions($offset: Int, $Id : Int) {
            transaction(
                where: {
                    userId: { _eq: $Id }
                    type: { _eq: "xp" }
                    path: { _iregex: "/johvi/piscine-go/" }
                    }
                    offset: $offset
                  ) {
                    type
                    amount
                    path
                  }
          }
`;

export let test = `
          query Test($offset: Int, $Id : Int){

          }




`;