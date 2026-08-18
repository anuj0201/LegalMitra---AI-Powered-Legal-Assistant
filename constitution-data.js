const CONSTITUTION_CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'fundamental-rights', label: 'Fundamental Rights' },
  { id: 'dpsp', label: 'Directive Principles' },
  { id: 'fundamental-duties', label: 'Fundamental Duties' },
  { id: 'union-executive', label: 'Union Executive' },
  { id: 'parliament', label: 'Parliament' },
  { id: 'judiciary', label: 'Judiciary' },
  { id: 'federal', label: 'Federal Structure' },
  { id: 'emergency', label: 'Emergency Provisions' },
  { id: 'amendment', label: 'Amendments' },
  { id: 'miscellaneous', label: 'Miscellaneous' }
];

const CONSTITUTION_DATA = [
  {
    article: "14",
    title: "Equality before law",
    summary: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
    fullText: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "15",
    title: "Prohibition of discrimination",
    summary: "The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.",
    fullText: "The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them. No citizen shall, on these grounds, be subject to any disability, liability, restriction or condition with regard to access to shops, public restaurants, hotels and places of public entertainment.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "16",
    title: "Equality of opportunity in public employment",
    summary: "There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State.",
    fullText: "There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State. No citizen shall, on grounds only of religion, race, caste, sex, descent, place of birth, residence or any of them, be ineligible for, or discriminated against in respect of, any employment or office under the State.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "17",
    title: "Abolition of untouchability",
    summary: "\"Untouchability\" is abolished and its practice in any form is forbidden.",
    fullText: "\"Untouchability\" is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of \"Untouchability\" shall be an offence punishable in accordance with law.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "18",
    title: "Abolition of titles",
    summary: "No title, not being a military or academic distinction, shall be conferred by the State.",
    fullText: "No title, not being a military or academic distinction, shall be conferred by the State. No citizen of India shall accept any title from any foreign State.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "19",
    title: "Freedom of speech and expression",
    summary: "Protection of certain rights regarding freedom of speech, assembly, association, movement, residence, and profession.",
    fullText: "All citizens shall have the right: (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; and (g) to practise any profession, or to carry on any occupation, trade or business.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "20",
    title: "Protection in respect of conviction for offences",
    summary: "Protection against ex post facto laws, double jeopardy, and self-incrimination.",
    fullText: "No person shall be convicted of any offence except for violation of the law in force at the time of the commission of the act charged as an offence, nor be subjected to a penalty greater than that which might have been inflicted under the law in force at the time of the commission of the offence.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "21",
    title: "Protection of life and personal liberty",
    summary: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
    fullText: "No person shall be deprived of his life or personal liberty except according to procedure established by law. This right has been interpreted widely to include the right to live with human dignity, right to privacy, right to health, etc.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "21A",
    title: "Right to education",
    summary: "The State shall provide free and compulsory education to all children of the age of six to fourteen years.",
    fullText: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "22",
    title: "Protection against arrest and detention",
    summary: "Protection against arbitrary arrest and preventive detention laws.",
    fullText: "No person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds for such arrest nor shall he be denied the right to consult, and to be defended by, a legal practitioner of his choice.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "23",
    title: "Prohibition of traffic in human beings",
    summary: "Traffic in human beings and begar and other similar forms of forced labour are prohibited.",
    fullText: "Traffic in human beings and begar and other similar forms of forced labour are prohibited and any contravention of this provision shall be an offence punishable in accordance with law.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "24",
    title: "Prohibition of child labour",
    summary: "No child below the age of fourteen years shall be employed to work in any factory or mine.",
    fullText: "No child below the age of fourteen years shall be employed to work in any factory or mine or engaged in any other hazardous employment.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "25",
    title: "Freedom of conscience and religion",
    summary: "All persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion.",
    fullText: "Subject to public order, morality and health and to the other provisions of this Part, all persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "26",
    title: "Freedom to manage religious affairs",
    summary: "Subject to public order, morality and health, every religious denomination shall have the right to establish and maintain institutions for religious and charitable purposes.",
    fullText: "Subject to public order, morality and health, every religious denomination or any section thereof shall have the right: (a) to establish and maintain institutions for religious and charitable purposes; (b) to manage its own affairs in matters of religion; (c) to own and acquire movable and immovable property.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "29",
    title: "Protection of interests of minorities",
    summary: "Any section of the citizens residing in the territory of India having a distinct language, script or culture of its own shall have the right to conserve the same.",
    fullText: "Any section of the citizens residing in the territory of India or any part thereof having a distinct language, script or culture of its own shall have the right to conserve the same. No citizen shall be denied admission into any educational institution maintained by the State or receiving aid out of State funds on grounds only of religion, race, caste, language or any of them.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "30",
    title: "Right of minorities to establish educational institutions",
    summary: "All minorities, whether based on religion or language, shall have the right to establish and administer educational institutions of their choice.",
    fullText: "All minorities, whether based on religion or language, shall have the right to establish and administer educational institutions of their choice. The State shall not, in granting aid to educational institutions, discriminate against any educational institution on the ground that it is under the management of a minority.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "32",
    title: "Right to constitutional remedies",
    summary: "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed.",
    fullText: "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, whichever may be appropriate.",
    category: "fundamental-rights",
    part: "Part III"
  },
  {
    article: "38",
    title: "State to secure a social order",
    summary: "The State shall strive to promote the welfare of the people by securing and protecting a social order in which justice, social, economic and political, shall inform all the institutions of the national life.",
    fullText: "The State shall strive to promote the welfare of the people by securing and protecting as effectively as it may a social order in which justice, social, economic and political, shall inform all the institutions of the national life. The State shall, in particular, strive to minimise the inequalities in income.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "39",
    title: "Certain principles of policy",
    summary: "The State shall direct its policy towards securing equal right to an adequate means of livelihood, and equal pay for equal work for both men and women.",
    fullText: "The State shall, in particular, direct its policy towards securing: (a) that the citizens, men and women equally, have the right to an adequate means of livelihood; (b) that the ownership and control of the material resources of the community are so distributed as best to subserve the common good; (c) that the operation of the economic system does not result in the concentration of wealth; (d) equal pay for equal work.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "39A",
    title: "Equal justice and free legal aid",
    summary: "The State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity, and shall provide free legal aid.",
    fullText: "The State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity, and shall, in particular, provide free legal aid, by suitable legislation or schemes or in any other way, to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "40",
    title: "Organisation of village panchayats",
    summary: "The State shall take steps to organise village panchayats and endow them with such powers and authority as may be necessary to enable them to function as units of self-government.",
    fullText: "The State shall take steps to organise village panchayats and endow them with such powers and authority as may be necessary to enable them to function as units of self-government.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "41",
    title: "Right to work, education",
    summary: "The State shall, within the limits of its economic capacity and development, make effective provision for securing the right to work, to education and to public assistance in cases of unemployment, old age, sickness and disablement.",
    fullText: "The State shall, within the limits of its economic capacity and development, make effective provision for securing the right to work, to education and to public assistance in cases of unemployment, old age, sickness and disablement, and in other cases of undeserved want.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "43",
    title: "Living wage for workers",
    summary: "The State shall endeavour to secure to all workers a living wage, conditions of work ensuring a decent standard of life.",
    fullText: "The State shall endeavour to secure, by suitable legislation or economic organisation or in any other way, to all workers, agricultural, industrial or otherwise, work, a living wage, conditions of work ensuring a decent standard of life and full enjoyment of leisure and social and cultural opportunities.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "44",
    title: "Uniform civil code",
    summary: "The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India.",
    fullText: "The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "45",
    title: "Provision for early childhood care",
    summary: "The State shall endeavour to provide early childhood care and education for all children until they complete the age of six years.",
    fullText: "The State shall endeavour to provide early childhood care and education for all children until they complete the age of six years.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "46",
    title: "Promotion of educational interests of SC/ST",
    summary: "The State shall promote with special care the educational and economic interests of the weaker sections of the people, and, in particular, of the Scheduled Castes and the Scheduled Tribes.",
    fullText: "The State shall promote with special care the educational and economic interests of the weaker sections of the people, and, in particular, of the Scheduled Castes and the Scheduled Tribes, and shall protect them from social injustice and all forms of exploitation.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "47",
    title: "Duty to raise nutrition and standard of living",
    summary: "The State shall regard the raising of the level of nutrition and the standard of living of its people and the improvement of public health as among its primary duties.",
    fullText: "The State shall regard the raising of the level of nutrition and the standard of living of its people and the improvement of public health as among its primary duties and, in particular, the State shall endeavour to bring about prohibition of the consumption except for medicinal purposes of intoxicating drinks and of drugs which are injurious to health.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "48A",
    title: "Protection of environment",
    summary: "The State shall endeavour to protect and improve the environment and to safeguard the forests and wild life of the country.",
    fullText: "The State shall endeavour to protect and improve the environment and to safeguard the forests and wild life of the country.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "51",
    title: "Promotion of international peace",
    summary: "The State shall endeavour to promote international peace and security and maintain just and honourable relations between nations.",
    fullText: "The State shall endeavour to: (a) promote international peace and security; (b) maintain just and honourable relations between nations; (c) foster respect for international law and treaty obligations in the dealings of organised peoples with one another; and (d) encourage settlement of international disputes by arbitration.",
    category: "dpsp",
    part: "Part IV"
  },
  {
    article: "51A",
    title: "Fundamental duties",
    summary: "It shall be the duty of every citizen of India to abide by the Constitution, cherish the noble ideals of the freedom struggle, protect sovereignty, and promote harmony.",
    fullText: "It shall be the duty of every citizen of India: (a) to abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem; (b) to cherish and follow the noble ideals which inspired our national struggle for freedom; (c) to uphold and protect the sovereignty, unity and integrity of India; (d) to defend the country and render national service when called upon to do so; (e) to promote harmony and the spirit of common brotherhood amongst all the people of India... [List of 11 fundamental duties].",
    category: "fundamental-duties",
    part: "Part IV-A"
  },
  {
    article: "52",
    title: "The President of India",
    summary: "There shall be a President of India.",
    fullText: "There shall be a President of India.",
    category: "union-executive",
    part: "Part V"
  },
  {
    article: "53",
    title: "Executive power of the Union",
    summary: "The executive power of the Union shall be vested in the President and shall be exercised by him either directly or through officers subordinate to him.",
    fullText: "The executive power of the Union shall be vested in the President and shall be exercised by him either directly or through officers subordinate to him in accordance with this Constitution.",
    category: "union-executive",
    part: "Part V"
  },
  {
    article: "74",
    title: "Council of Ministers",
    summary: "There shall be a Council of Ministers with the Prime Minister at the head to aid and advise the President who shall, in the exercise of his functions, act in accordance with such advice.",
    fullText: "There shall be a Council of Ministers with the Prime Minister at the head to aid and advise the President who shall, in the exercise of his functions, act in accordance with such advice: Provided that the President may require the Council of Ministers to reconsider such advice, either generally or otherwise, and the President shall act in accordance with the advice tendered after such reconsideration.",
    category: "union-executive",
    part: "Part V"
  },
  {
    article: "76",
    title: "Attorney-General of India",
    summary: "The President shall appoint a person who is qualified to be appointed a Judge of the Supreme Court to be Attorney-General for India.",
    fullText: "The President shall appoint a person who is qualified to be appointed a Judge of the Supreme Court to be Attorney-General for India. It shall be the duty of the Attorney-General to give advice to the Government of India upon such legal matters, and to perform such other duties of a legal character, as may from time to time be referred or assigned to him by the President.",
    category: "union-executive",
    part: "Part V"
  },
  {
    article: "79",
    title: "Constitution of Parliament",
    summary: "There shall be a Parliament for the Union which shall consist of the President and two Houses to be known respectively as the Council of States and the House of the People.",
    fullText: "There shall be a Parliament for the Union which shall consist of the President and two Houses to be known respectively as the Council of States and the House of the People.",
    category: "parliament",
    part: "Part V"
  },
  {
    article: "80",
    title: "Composition of Rajya Sabha",
    summary: "The Council of States shall consist of twelve members nominated by the President and not more than two hundred and thirty-eight representatives of the States and of the Union territories.",
    fullText: "The Council of States shall consist of: (a) twelve members to be nominated by the President in accordance with the provisions of clause (3); and (b) not more than two hundred and thirty-eight representatives of the States and of the Union territories.",
    category: "parliament",
    part: "Part V"
  },
  {
    article: "81",
    title: "Composition of Lok Sabha",
    summary: "The House of the People shall consist of not more than five hundred and thirty members chosen by direct election from territorial constituencies in the States.",
    fullText: "Subject to the provisions of article 331, the House of the People shall consist of: (a) not more than five hundred and thirty members chosen by direct election from territorial constituencies in the States, and (b) not more than twenty members to represent the Union territories.",
    category: "parliament",
    part: "Part V"
  },
  {
    article: "110",
    title: "Definition of Money Bills",
    summary: "Provides the definition of a Money Bill in the Parliament.",
    fullText: "A Bill shall be deemed to be a Money Bill if it contains only provisions dealing with all or any of the following matters, namely: (a) the imposition, abolition, remission, alteration or regulation of any tax; (b) the regulation of the borrowing of money or the giving of any guarantee by the Government of India... etc.",
    category: "parliament",
    part: "Part V"
  },
  {
    article: "112",
    title: "Annual financial statement",
    summary: "The President shall in respect of every financial year cause to be laid before both the Houses of Parliament a statement of the estimated receipts and expenditure of the Government of India.",
    fullText: "The President shall in respect of every financial year cause to be laid before both the Houses of Parliament a statement of the estimated receipts and expenditure of the Government of India for that year, in this Part referred to as the 'annual financial statement'.",
    category: "parliament",
    part: "Part V"
  },
  {
    article: "124",
    title: "Establishment of Supreme Court",
    summary: "There shall be a Supreme Court of India consisting of a Chief Justice of India and, until Parliament by law prescribes a larger number, of not more than seven other Judges.",
    fullText: "There shall be a Supreme Court of India consisting of a Chief Justice of India and, until Parliament by law prescribes a larger number, of not more than seven other Judges. Every Judge of the Supreme Court shall be appointed by the President by warrant under his hand and seal.",
    category: "judiciary",
    part: "Part V"
  },
  {
    article: "141",
    title: "Law declared by Supreme Court binding",
    summary: "The law declared by the Supreme Court shall be binding on all courts within the territory of India.",
    fullText: "The law declared by the Supreme Court shall be binding on all courts within the territory of India.",
    category: "judiciary",
    part: "Part V"
  },
  {
    article: "214",
    title: "High Courts for States",
    summary: "There shall be a High Court for each State.",
    fullText: "There shall be a High Court for each State.",
    category: "judiciary",
    part: "Part VI"
  },
  {
    article: "226",
    title: "Power of High Courts to issue writs",
    summary: "Every High Court shall have power, throughout the territories in relation to which it exercises jurisdiction, to issue to any person or authority, including in appropriate cases, any Government, within those territories directions, orders or writs.",
    fullText: "Notwithstanding anything in article 32, every High Court shall have power, throughout the territories in relation to which it exercises jurisdiction, to issue to any person or authority, including in appropriate cases, any Government, within those territories directions, orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, or any of them, for the enforcement of any of the rights conferred by Part III and for any other purpose.",
    category: "judiciary",
    part: "Part VI"
  },
  {
    article: "1",
    title: "Name and territory of the Union",
    summary: "India, that is Bharat, shall be a Union of States.",
    fullText: "India, that is Bharat, shall be a Union of States. The States and the territories thereof shall be as specified in the First Schedule. The territory of India shall comprise: (a) the territories of the States; (b) the Union territories specified in the First Schedule; and (c) such other territories as may be acquired.",
    category: "federal",
    part: "Part I"
  },
  {
    article: "3",
    title: "Formation of new States",
    summary: "Parliament may by law form a new State, increase the area of any State, diminish the area of any State, alter the boundaries of any State, or alter the name of any State.",
    fullText: "Parliament may by law: (a) form a new State by separation of territory from any State or by uniting two or more States or parts of States or by uniting any territory to a part of any State; (b) increase the area of any State; (c) diminish the area of any State; (d) alter the boundaries of any State; (e) alter the name of any State.",
    category: "federal",
    part: "Part I"
  },
  {
    article: "245",
    title: "Extent of laws made by Parliament and State Legislatures",
    summary: "Parliament may make laws for the whole or any part of the territory of India, and the Legislature of a State may make laws for the whole or any part of the State.",
    fullText: "Subject to the provisions of this Constitution, Parliament may make laws for the whole or any part of the territory of India, and the Legislature of a State may make laws for the whole or any part of the State. No law made by Parliament shall be deemed to be invalid on the ground that it would have extra-territorial operation.",
    category: "federal",
    part: "Part XI"
  },
  {
    article: "246",
    title: "Subject-matter of laws",
    summary: "Provides the subject-matter of laws made by Parliament and by the Legislatures of States (Union, State, and Concurrent Lists).",
    fullText: "Parliament has exclusive power to make laws with respect to any of the matters enumerated in List I in the Seventh Schedule (Union List). The Legislature of any State has exclusive power to make laws for such State with respect to any of the matters enumerated in List II in the Seventh Schedule (State List). Parliament, and the Legislature of any State, also have power to make laws with respect to any of the matters enumerated in List III in the Seventh Schedule (Concurrent List).",
    category: "federal",
    part: "Part XI"
  },
  {
    article: "263",
    title: "Provisions for inter-State councils",
    summary: "If at any time it appears to the President that the public interests would be served by the establishment of a Council, it shall be lawful for the President by order to establish such a Council.",
    fullText: "If at any time it appears to the President that the public interests would be served by the establishment of a Council charged with the duty of: (a) inquiring into and advising upon disputes which may have arisen between States; (b) investigating and discussing subjects in which some or all of the States, or the Union and one or more of the States, have a common interest; or (c) making recommendations upon any such subject and, in particular, recommendations for the better co-ordination of policy and action with respect to that subject, it shall be lawful for the President by order to establish such a Council.",
    category: "federal",
    part: "Part XI"
  },
  {
    article: "352",
    title: "National Emergency",
    summary: "If the President is satisfied that a grave emergency exists whereby the security of India or of any part of the territory thereof is threatened, whether by war or external aggression or armed rebellion, he may, by Proclamation, make a declaration to that effect.",
    fullText: "If the President is satisfied that a grave emergency exists whereby the security of India or of any part of the territory thereof is threatened, whether by war or external aggression or armed rebellion, he may, by Proclamation, make a declaration to that effect, in respect of the whole of India or of such part of the territory thereof as may be specified in the Proclamation.",
    category: "emergency",
    part: "Part XVIII"
  },
  {
    article: "356",
    title: "President's Rule",
    summary: "Provisions in case of failure of constitutional machinery in States.",
    fullText: "If the President, on receipt of a report from the Governor of a State or otherwise, is satisfied that a situation has arisen in which the Government of the State cannot be carried on in accordance with the provisions of this Constitution, the President may by Proclamation assume to himself all or any of the functions of the Government of the State.",
    category: "emergency",
    part: "Part XVIII"
  },
  {
    article: "360",
    title: "Financial Emergency",
    summary: "If the President is satisfied that a situation has arisen whereby the financial stability or credit of India or of any part of the territory thereof is threatened, he may by a Proclamation make a declaration to that effect.",
    fullText: "If the President is satisfied that a situation has arisen whereby the financial stability or credit of India or of any part of the territory thereof is threatened, he may by a Proclamation make a declaration to that effect.",
    category: "emergency",
    part: "Part XVIII"
  },
  {
    article: "368",
    title: "Power of Parliament to amend the Constitution",
    summary: "Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article.",
    fullText: "Notwithstanding anything in this Constitution, Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article.",
    category: "amendment",
    part: "Part XX"
  },
  {
    article: "370",
    title: "Special status of J&K",
    summary: "Temporary provisions with respect to the State of Jammu and Kashmir (largely abrogated in 2019).",
    fullText: "Temporary provisions with respect to the State of Jammu and Kashmir. (Note: Most provisions were rendered inoperative by a Presidential order in 2019).",
    category: "miscellaneous",
    part: "Part XXI"
  },
  {
    article: "371",
    title: "Special provisions for certain States",
    summary: "Special provisions with respect to the States of Maharashtra, Gujarat and others.",
    fullText: "Special provisions with respect to the States of Maharashtra and Gujarat, and subsequently added provisions for Nagaland, Assam, Manipur, Andhra Pradesh, Sikkim, Mizoram, Arunachal Pradesh, Goa, and Karnataka.",
    category: "miscellaneous",
    part: "Part XXI"
  },
  {
    article: "Preamble",
    title: "Preamble to the Constitution",
    summary: "The introductory statement of the Constitution that sets out the guiding purpose, principles and philosophy of the Indian Constitution.",
    fullText: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.",
    category: "miscellaneous",
    part: "Preamble"
  }
];
