
export const clientDataHelper = (data: string | undefined) => {
   if (!data) return
    const givenObject = JSON.parse(data)
    const formatDataObject = (givenObject: { data_object: string }): string | null => {
        const dataObjectString: string = givenObject.data_object;
        if (!dataObjectString) return null;
        let output: string = '';
        const pairs: string[] = dataObjectString.split(" ");
        pairs.forEach(pair => {
            const [key, value]: string[] = pair.split("=");
            output += `${key}: ${value === "None" ? '-' : value}\n`;
        });
        return output;
    };
    
    


    return({
        "Summary": formatDataObject(givenObject),
        "Currency": givenObject.currency ?? "-",
        "Current Stage": givenObject.current_stage.name ?? "-",
        "Gender": givenObject.gender ?? "-",
        "Language": givenObject.language ?? "-",
        "Product Type": givenObject.product_type ?? "-",
    })
}

export const uuid = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let uuid = ''
    for (let i = 0; i < 10; i++) {
      let r = Math.floor(Math.random() * 26)
      uuid += chars.charAt(r)
    }
    return uuid
  }
