function linkifyPhoneNumbers() {
  const phoneNumberRegex = /(?:\+\d{1,3}|(?:\(\d{1,3}\))?)\s*(?:\d[\s-]*){9,20}/g;
  const textNodes = getTextNodes(document.body);

  textNodes.forEach((textNode) => {
    const phoneNumbers = textNode.textContent.match(phoneNumberRegex);

    if (phoneNumbers) {
      const parentNode = textNode.parentNode;
      const fragment = document.createDocumentFragment();
      let remainingText = textNode.textContent;

      phoneNumbers.forEach((phoneNumber) => {
        const index = remainingText.indexOf(phoneNumber);
        const textBeforeNumber = remainingText.slice(0, index);
        remainingText = remainingText.slice(index + phoneNumber.length);

        fragment.appendChild(document.createTextNode(textBeforeNumber));
        fragment.appendChild(createWhatsAppLinkElement(phoneNumber));
      });

      fragment.appendChild(document.createTextNode(remainingText));
      parentNode.replaceChild(fragment, textNode);
    }
  });
}

function getTextNodes(node) {
  const allNodes = [];
  const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

  while (treeWalker.nextNode()) {
    allNodes.push(treeWalker.currentNode);
  }

  return allNodes;
}

function createWhatsAppLinkElement(phoneNumber) {
  const url = `https://wa.me/${phoneNumber.replace(/\D+/g, '')}`;
  const imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAMAAABNO5HnAAAAPFBMVEVHcEwqsxj4+Pgqsxgqsxgqsxgqsxgqsxgqsxg1tyTv8O8nshVhxVRJvjrM6Mjg7t5+z3OY15Cy4Kzy9vL7mje2AAAACnRSTlMAWf//L5LPBbD8PDtMNAAAF5lJREFUeNrsnYt246oOhneT9KQ22Ab0/u967NxsQFxsQKZTmLX2tNOZ7vTLb0lIAv33X1tttdVWW2211VZbbbXV1j+77n9inQr49vX1/f398yfW/IN+fd2ogS+Mv3/+113/2Or+9/M906aiPEP+e4y3tClg3+8z5eufXzPre1kxN8or62Kyvn/9dA3wxob8FJF1w0yC+n6bMbOGVl9sRp3XgNy+u2vjjKP+vmW0Gs0F+txiLvtx+24w/aY6j6ibnMP2I4Oo718t1ogRdSrp2Ww0Hxgl6u8k0refxjB2/SQY6lszz3uij1vjXDfpxpmGdONMQ7pxpiF9b/HGsdhjX5R3v7dt98G1M55unI+T3pV9bvvu42b6qznC2hxiM9BEZvqrsUpbX81wVGU8muEgiTxaxJFhdbe2Jaxmg9hKV1kk/dUEXYmkm6CzLBaSdBM00a6lhRzZJH1rMTQN6W9vGrptCvNtD+8ty3F6xqOl7Yj24S2dlNV23JrlONt2NMtBYjtazEEVd7TdSt7l3LM0E01kpJuJpjHSLaGUezlypc0XEnnD5guJvOGtkcm9bvhBtwaGJuxoQQdR2NFAN9D/FugWRtME0m2/0kA30G010A10A91AN9CfxbDVQOcFfL12wzBwLuYll7V8wPkwdN37LzTQaYxnwlxIpcZp6gHgsi6AfprGUcmFeHetjfZvAf1gvCAepy1ddM3ERyWetBvofZSvs47V2OuM4fMbfD7ZfHUapagHdv2gH0pWuI4xwLq2F9hVsK4c9EJZjj2CF0zcYEh8VbaahX0665pBPymDZie2DBGbsfl8++e9Ol3X9YJm15WyDtEEbAHHzMmTdQNtUR6E6jFTDB4bvRKHj33ZvB+T5B1roHXMuphxQfujDkzfs6zPstZVguZqctgFuIAbo/4W4P4RxpMsSHWgWcc/NgOcbi4oaUD+4eu3SZ6BujrQOmYIeDrcKYLftsOC+k+DZitmwDcnaNiBWGjsy6tJeaia/WHQgzQwQyB403mC5y3Qo2tYbDVtBFIPaNbJSdMkWLbWECd49uH2zmUbtTzdIqc01fWA5iMWyBnPPmqlbfGDS9C6rilNdS2gh5dxBpezAzRhZxlfZ9QBF20P8/xtorMfVYBmnZishAYYZsOE7YlCIGYf81yK/yHQbFAQCNh08xEOpF3bGNtfUom6BtAvOYdCtsvF9I+uBDXEbs0fX1Qkkd7poN9yhsAWEFDWAP1zgdug+BX9EDVB+HE66DXYCIVsW9rTNKql9s05H+Zf/FEQf9Rse7jE5Zo2f6GX5c3HuaDZ02wAHomhCuwfde61r4CtDR7XR42cGwXcoKCXj8fi5uNc0J0E3AjjWlzKrfxJ2HzDXg//E/iMW6qpv0QK+vGt+T8MejbPeDIIE2P/KP1F1qPYo24uxylC0kTm40zQT/Pso/v5s1HyvUW/GXY3CDVdgmHH67OypE8ELSaELZZVXkpQiy0+VqsRY3/xaBqI4rzzQIveUUrVUfSpJRHWcensbtL/vKRLPAv0yw0Cts3Yuj/Fk4t87CFruDg0vf144uzfAs2enMHaWoCWB8pVdFrM9Vq58WVKygUfp4Bmnbo4U/trFiJvbe+F2i/pcqRPAf3k7Nj9vf5booTKFfgkDSVJnwB60bN7+/f8Sl+mUt2J8eJTNJQjfQLorZ7BmSUu4pXYJ/PtEnQx0vSgOxnIFhdOEQ+6qcayeSViD3rQn3gDXN2IpRM8YnRG1eWiPHLQAi6u6h8QJYfZo63Bk88rsXMhBs2e+0FwdslQlDvYdvtv2GsolTalBc34pO9TDE2RVaUfiUM0pH674+5Xgx4mb/FvpCpJP3xy7wipn9jlLwbNhtHX8QKKth9OL+6YkgbxixWtfCVuisKdHlPzES3vvCsBeUMPStACLu7DVJO4Ei/2rPA4UoeQ2SESgua9pzw98esJS6tZWh9mdYhkoHUDbUq6YCI4TFrPesD6IuVvBP3OjKI7hPEkznNILZ3nvfKaaTLQwmr4XIGPw4kHAEVvNgZDiR0iEejnTsVho0/lbBUvtSKP+m2K7pTr+OXpnLVoyJR0L9ivAs0kOA8OTsPpdw9IsM8ZvFO2uV4dCeiX4cDC6NPiDZs0omjIZzxIQL8NB2Khq+C8Fn1MQV8gl/GgAM0EoH34Dxt4rWG9y/KA3FiRyYUQgGbDpGfs1mAK5LWSNW+nwGpozbltoVC01LSyNYeqmqENm0y52Q2fx7qVB738CIAbjsBTSXpt4Fr7sfJL6pcoWqEtSRCSCrsuVwjyYVk0oYerHz7LTrw8aN67Tld5HWEnlgMp8695jSRH5LsROaX7fPK6XwC6G10Nb94nkqt+uyiM+ZomMA94QIYQrzBo9gntLEH7DDQTU68vgvDk9VqxfsAMki6taIegA4aPm5x7ko16pxynwTJIuixoVNDhKrPNmUTSj4gf7zdNl3RhRTsF7TEcjI82536kCD2YcPQvpUu6MGgOeEeQJ4PABoxzny9hGWE87AcwWdJlQXfKcXLEE0V0CuXc0+wil8gDPYCXGksXBc14j7dterYq8w4NXyR5Prbdtuh3IFStaJegpbNjdPZHDtAk7vCVAUMOI6ZuD4uCHhzHVj2esJMuzkQlLyYcLXmyXkUz6RC0xxNyp6CJ3KEdKL3NXdr7XBJ05+is93lw5ebcjyTu0Ar9w/I4GTTjgJ+68oV2HkH3RGUvXdK59uElFa3wQyq+Fyx731JXeknDeio96X0uB3pTwYq10LOYvKCJOhNckpZ1KhrN2y0HvIdjrpDOHV4dgUeS7ShoOhxBtPS9N37OVO5Qi6Uhz+6wHGhHEO19/FUAdE/iDhmTeNwha1T0I/BHBK28xjEEmsgdDhNa1Jq6GhWt0JDD+/gNUwg0lTvEr7lIsR2lQL9iDivk8FnZoC+kSnhs89KaBZEVKprjtULvS+VBzkT5/+c5ELv9NcEZFwMt0dKK15sFgw6yCI9t0jTRnvwc0I48hzd7HwWaJsJbu1GiN1vngLbTuq+SLEsFTZzwMIVSm+lYgjvYVVl57MgiQBO5w1elxTR+x5+nUqbjyOtkNYFGy8oJiaVCoB0m2m85IkHTNJcOE7rfEnWBxl7mkjbw6yEmju7JzhYp3JtXZjo4eqPdNITenmosxzuFl81IF1K0RE8jq6DBqUfQj1YJ+37aw///QopW6Ni7oIFT4f0KlaA/bsYYrsOrAv16kUZvRPhFBr0h5aEXhV5HJGoC/dmuGNd+hh47xmsxHC8jjcxelTXZaMbR05thRzIEaoaUt6e8fgjYUVqmBy3QGRwRYpCVGOg10WumpKeqQEv0hH2EeeNVRHZmugMyJPDKOEOFHUmOcNjMZzsk9elPhV5LxCsCvUl9be8Bi9ACk1UEHOtzaZdZRG2gLU8SYd2YexdOf33Kpq80OtNLDHoT3W26I2L8NXPuWST5dROPsMOushz0FGVAozOnVdxPN9UCWutMgdRrlkqAfkvBiDripOA6wjJ254C2JH3whRQAzZCLUHakcl2SFuSS7kZk5nhFoD9NSsYsyEhSTknTX3KF1g2nekBrqdyVd2QA6rbS5LZDYe1KB3csRRQtsVl28eU2eWr92wANmXo7iihaYo3cffQLdG0Pyf2hxALpvjLQlqTjleAs0hIbj/eTCTkK4UVAKyTrv+eRc/lDauMhsCvyqwNtHojcAdpZpaWNPNAuIIC6QNs3+0x7+kBFDRm8T7JD+2GqV/S+hltVQe5/ux/Yle39NTbak5imNNNvRRtDcGtV9P6ow7ttITTTiKKPZ/6LgbZSjHsDfce2hXIsjsCmEtSkaInVgPaCdsV4vSIbjCOxvrb6QBsJxt07KmcnHlnogTW2QV9ZrsPq7NivBHE2aYWdVK4p1yHQySZ7QTN3lwfRWC1lt97Vlb0T9kBXOFI+dprpeDud8oZ0Y8aj90UUjR9L2A/a0+YRGXt0Q8LYa6xVs64KC0fvQ5RHvtPUp7QfiHEalTjI+n1swdgQjNd6FD2gwy8PlI8ZczrEmI7H19s0HpzmPvTYICRVE2js7rhDz5zHIfahAbUbwzPJAxPdGQf0LokaO5XSb6xlnafB1G+oNVc6qd2omUAne4kKe+/0F3ksLmKd57zF6BsibrxDM+p9QSGT6Ki6mkAzhY7c5gd9ku9kixoCBlr7y/tQoymbvqZuUvMKR0h66Ly9vC5L7fhHe1BrBjC126Bcxz+i6cOHIf0nLkbE+rrfnDEatXYoNfm6n0JnWHpsOvHxdgHuJT0pK3zzGfZIVWtBR3KPY8lTWdu+tbTZgIzxwCkiM1L2nYWBXomOxdk/u8mxqlNZ+uyY1GpbDOkF9WbUU/C84hiBGp8NKKo7OYuMYjze4xwmPbP7qDrm8L7iQRecJQdZFvSn2gZr91ratMsI0gvqRdVRlyT0EJqItvoZbYB5ZWfB8cOQKQdfWei05wt114mxj1oBIyB23319hqIHZOxU8uiHCNL9NEZiDoJW6L19h9v/Ct5AY9w5mXKQOmaPuHv5r8MxcqTvH6GyG2g2BWTNhiQ23nozTLuXl9k7is7Ta3AteEuYPSc3xwjGTk40oD8V8Fwzs0reewebDcv7cs/koqrIRtr7pm/PpO64Q4fedGzub9m6w+Sm/ZgwL275QyDsMCdUeJPjdnTydm5yhpu2c7lEf3erwu6ArfFu0rUSro/bznA6gnVZzIcKh6fmNIUqb9sd7DnbuebkhrJ56dHd+/5oM60k67uo+11lge2eZfkoT3/zkBzneRutO3XBjkr2vEbQAqym/2zTzOcNuUgUtf9q9h6rfyc9juVAWwUKiLlwd8f3TwupZdiTW4FHlVMrrJtyLhlmbOiiTrHUvvebmZNNIKm6XBq0Pih33bdkvLsuIfyQocQdZOu6Kw4amXiTYVyd6RSng0G0b0rJaF+CkZwSKzn9zbisez0Hl7O5masDqEceiu3s0A5qnf5m3lcLRSS9mOrdqp687WGfO86MQLreeYb6fbWlJL3UXuS4T8/+tBVYO9oMM9iLzpwVuiyyBx4bsyriLYi/NfJZlAU9VoJL1TNnr3pB69D5++ikXhdpQULNvmutEPQcb8VTlLcpPP3esDIXb8TIOtxlYF8NlmEQKs2key31n3V7iMh69LGOaFGSyNY7sVWCQNFWWvfNutRFo+zqZj1FYN52c2jSSE6kFwb9jvDANNblroNYWAtlwp5GGdPb2I32xjvDrOryoDuzN+wT4pU8/Mr+3961bTcKw8AASRNzx/r/f13MLRhLQMByyVbah+3pbttkOozHsix1YDdal11o3dS52nWzogZ06ttZb8cPdDIbwj5pNXjLlq6C3aKtVFEo1UO/1yaB07zRB6HZgVYau33qeXeIK4j99ycv1m2kdP7lcgOd1Fg3Gkjz8M1zdwpHDItSNi+E5gdaY3yOf6F37g4zWs1hnl8Q8vD8MQM9bWjBrndsLohzUWJpXfBkRrmBtk7fwMvMeK7Q6JTc2EsxCj/QbptSYEl2+BJojNFeHBK3RmvkNBlifT3hyCuK0H5YwQz0kL9bEDquL0do5NxtBNzPesILNFHxczlzt1izra2hJ4PEzGj8rt7lzJ3C5p6Cr7LMAEC7OZpuZ3s1c6caks/eXmuYfPSizvhaEp2phjQc/s43eYGu0cunVzN3DZCE9reasAKtdHx4xFBgnAlC+xM51lNwZGbWibFeAfk83SLz9+xxFtAgE4auZu5wfZ42sB5fKSujG2ys4ZXM3YAzwWfw6Y4CVSp5aUTDsE/RJJ3B8wkyd+3dIoN+KXM3JEYJPnuuXONkdI0S+jrmLkeHjnEINDPQGlPoq0h0ltSVOythlo/xXBDBX4juTAe/BqEHu0ERGnynCRiBzgG7Tn0Rc5eX2ODe98v0XkrFKB2NM6QOPp57w+XqZrKBCrT/gQ18QB/uD5Cxl3wUGtAt69vq+1+w+YAuUrc5wHZ/gBbloghEZ3co5PBZDmPEeHMW69u++h66krlGV1XNNyshS3INSMsWq4cBxzLCx2jtGI7VGzdZpopal311QpknGZNqNFVMlMlMRp9lueYC2mrEsNWCxuiFKWueVSVrDqhb1SiRIpMAfA7Rr2Prlm+rF92diGWPvKbwDLWBGbvnEYLP/B1olk2BbYkeqYxVM3mGOlODODs/yXqVbGP8uJpX2W3+ASn6yQYqg3MtfzIDh2YgEAvAyGakEHDu8tm2U5xdwhBGj+ZuoHJqr0vuprhr9nz2vXc3PmG5QcEIzTgska3vHTIrZpip3V986KhMnG5YS1XXRTc7Q+ZcVzHai2qp0JxDKbk0WhOVMzMqu28dq6swCqKPYt1fiIM4RoVikSrnHUnJ1QQWHUQQNyOVscUP8IPo7sMDWPfbnzKlDriXP5J5pBwT0Msm/yOj5+8bYkAuTgI2HWDA2lyt2oV2v9B2KIN78wcldMU8n5kJaHxWTIw1/0EfbJzj5k5mXnRoZyTEI8gVxGSGzv1UmSffCLQqMXwhxpM5EBObtHe13uy/VKW5NlioAdV3mJ+rCnO/sEzB6eWEUvptO9nP13iAJro/YXiThAbakwCYhty6aeq6zvtoPzIXOKsKfyyAfDUB5JkP6LHmDmEnsvfFJdq9JYzaQeiDLuoi9Wt2/ZhbNviA1ptvGu2UuG0NCLhJeQdrhhTa4ykNM2g84PQ3cvPrOADY8Q/UPsf1K/SC3Jn0OglyiMkzCjVdfY7RbA5sO4Nl5m3+Z/zLFmZA9inWb21letw3AE0V0BPpScpEA10VR3J6SWhYJXQZiM5c0qHjndsxWObrNglN/otzPkV9wRtzM/YpSb4X6KyoNhiNCu4+Qlu5Pks73OZNQIt8nxhMApaY+Ae6K4teMQaw5SD2EHrzy4D8VgPiZa2CVvJwSEdD5y1wQs+9gluBCpSRRvo92CNBaUKHhpkFaFWiqTjYZm5aNnmu03gjFiJCJQDJOtFfgJlFOgZzh7DQoecMpyk7l/R5etjBaXCmcS26CqECb4bEJcn3A53UhCmmZTc2PbymfLM5ear2UhqVf6Apnf4Gm5mA1pSHcD8LQ+6zS31aWan+LHWL04BnRWLqGfp4NviFgc6IPgE4wywqW+ep9knfGqXxZJP7aSi9l4r8KtA5rJyUWJPUBirTyda6TNcumaDbeVi26Bx3J3pn67uvkY5mj4UGisr2Lw0/9MNOdNcdTX/kmPxmeAdalfQub1Tl0lC5BXnHzOi+rytlYygtnhua9Pgh+oWBzpDMne3IKt3k6oP3nVllpmgOjs6T7HtwvpLRzuHKnNDthuQAubKx5KasYGtxnMGeml/pzgfnG6VDU1vAaUNy9FlJzMmraaMLG9n88fx2Z23Cd0rHoiz6TWVfT3CLdnfQXVYt4jAaDHNumKZV1XfWNUfkVwKZBPr2OPz9cvBNZVezO5utimI4/e6j/bjrrJtdDeEhHje/QC/KolOGxWgqSDWQ9rC+KzsuGyjQz+iUuZvVFRWKccnP0A8vGhHK6KNAZ0W6sbf+s+EX6L6hQU9lAXkH0PejN6F1R2UlVHY09Y5q9PPn4Lerhcp4/KDu7tTWUEDdb6PP+DuJD2z0idVQ4pO18MRqKPHBWmhE+kfACbAWikiHkmgR6UAS3Yq0aIdP5biTQIt2hFEO0Y5AyiG+I4znaHEW7QijHLJnCbBb8T9r72/H67kK9C0SSvshdLSOs1DaT2RbhBZKByJ0G0LpAAotxiOI5ZB9eBgPLaklb5vCXYSWjAdrlsOyeCIe54TjuRNoEY8gwiFmmt9Ce6gslfgEZ5HpEALd1+FJzoNvS2gjLQviwYXwQ6TFenAbDkE6NM6CdCicBelQOLdIi/fY7zdO4Cx+mss/I35aduM7IlPRKZx7pEWot+X5LM69UIt8bMnG/eYlhNQB6DySWpSaCOWLzpPRE6gxmF/3581vPCOB2vEar8g3zAI1xmYWmDuo7w9ZFscl8HHngnmgtWBtUI5YUTYbmHZdbLH+wxqiWpRbMjMDPWlI9Hj9PbTVz6sDOWw8W7Sjx+Px+hPRvtHofjcP9C080O98yH8f0xu9SUhISEhISEhISEhI/HfxD8tvmUPk4xUxAAAAAElFTkSuQmCC'; 

  const linkElement = document.createElement('a');
  linkElement.href = url;
  linkElement.target = '_blank';

  const imgElement = document.createElement('img');
  imgElement.src = imgSrc;
  imgElement.style.height = '28px';
  imgElement.style.marginLeft = '4px';

  linkElement.appendChild(imgElement);

  const phoneElement = document.createElement('span');
  phoneElement.textContent = phoneNumber;

  const wrapperElement = document.createElement('span');
  
  wrapperElement.appendChild(phoneElement);
  wrapperElement.appendChild(linkElement);

  return wrapperElement;
}
function removeWhatsAppLinks() {
  const linkElements = document.querySelectorAll('.whatsapp-link');
  linkElements.forEach((link) => {
    const textNode = document.createTextNode(link.childNodes[0].textContent);
    link.parentNode.insertBefore(textNode, link);
    link.remove();
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleChanged') {
    if (request.whatsappEnabled) {
      linkifyPhoneNumbers();
    } else {
      removeWhatsAppLinks();
    }
  }
});

chrome.storage.sync.get('whatsappEnabled', (result) => {
  const whatsappEnabled = result.whatsappEnabled === undefined ? true : result.whatsappEnabled;
  if (whatsappEnabled) {
    linkifyPhoneNumbers();
  }
});
