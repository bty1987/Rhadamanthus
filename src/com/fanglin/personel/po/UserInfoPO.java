package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "userinfo", catalog = "communion")
public class UserInfoPO implements java.io.Serializable {

	private static final long serialVersionUID = -3915898990885585486L;

	public static final short POLITICAL_MASSES_INT = 0;// 群众

	public static final short POLITICAL_TEAM_INT = 1;// 团员

	public static final short POLITICAL_PARTY_INT = 2;// 党员

	public static final short HOUSEHOLDTYPE_COUNTRYSIDE_INT = 0;// 农村

	public static final short HOUSEHOLDTYPE_TOWN_INT = 1;// 城镇

	public static final short EDUCATION_SMALLSCHOLL_INT = 0;// 小学

	public static final short EDUCATION_FIRSTSCHOLL_INT = 1;// 初中

	public static final short EDUCATION_MIDDLEJUNIOR_INT = 2;// 中专

	public static final short EDUCATION_HIGHSCHOLL_INT = 3;// 高中

	public static final short EDUCATION_JUNIORCOLLEGE_INT = 4; // 大专

	public static final short EDUCATION_UNDERGRADUATE_INT = 5;// 本科

	public static final short EDUCATION_GRADUATESTUDENT_INT = 6;// 研究生

	public static final short EMPLOYTYPE_FORMAL_INT = 0;// 正式

	public static final short EMPLOYTYPE_TRIAL_INT = 1;// 试用

	public static final short LEVEL_STAFF_INT = 0;// 员工

	public static final short LEVEL_CORESTAFF_INT = 1;// 核心员工

	public static final short LEVEL_EXECUTIVEDIRECTOR_INT = 2;// 主管

	public static final short LEVEL_MANAGER_INT = 3;// 经理

	public static final short LEVEL_CHAIRMAN_INT = 4; // 总监及以上

	public static final short EMPLOYWAY_CAMPUS_INT = 0;// 校园招聘

	public static final short EMPLOYWAY_NETWORK_INT = 1;// 网络招聘

	public static final short EMPLOYWAY_INSIDEI_INT = 2;// 内部推荐

	public static final short EMPLOYWAY_ACTIVE_INT = 3;// 主动应聘

	public static final short EMPLOYWAY_HEADHUNTING_INT = 4; // 猎头

	public static final short INSURANCETYPE_SOCIALSECURITY_INT = 0;// 社保

	public static final short INSURANCETYPE_COMMERCIALINSURANCE_INT = 1; // 商业保险

	public static final short FORM_OUTPUTVALUE_INT = 0;// 产值

	public static final short FORM_NONOUTPUTVALUE_INT = 1; // 非产值

	private long uiid;

	private UserPO user;

	private short level;

	private int gender;

	private int height;

	private int weight;

	private short political;

	private String nation;

	private String hobby;

	private String qq;

	private String wechat;

	private String email;

	private short isMarried;

	private short isBirth;

	private short isHouseLoan;

	private short isCarLoan;

	private short isCarID;

	private short isPassID;

	private short isHMID;

	private short isTWID;

	private short householdType;

	private String hometownAddress;

	private String address;

	private String lover;

	private String claner;

	private String clanerCom;

	private String emergencyMan;

	private String emergencyPhone;

	private UserPO fangliner;

	private String firstTime;

	private String entryTime;

	private short employWay;

	private String recommendMan;

	private int jobYears;

	private short employType;

	private String employTime;

	private short isPresentGraduate;

	private String graduateTime;

	private String school;

	private short education;

	private String specialty;

	private String isContract;

	private String signTime;

	private String eignTime;

	private String fignTime;

	private int signNum;

	private String preformNum;

	private String formTime;

	private short isInsurance;

	private short insuranceType;

	private String insuranceTime;

	private String pensionNum;

	private String medicalNum;

	private String publicNum;

	private String palary;

	private String salary;

	private String bank;

	private String bankCardNum;

	private String comment;

	private String rank;

	private short form;

	private String hometownPlace;

	public UserInfoPO() {
		super();
	}

	public UserInfoPO(UserPO user, UserPO fangliner) {
		super();
		this.user = user;
		this.fangliner = fangliner;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "uiid")
	public long getUiid() {
		return this.uiid;
	}

	public void setUiid(long uiid) {
		this.uiid = uiid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "recommendMan")
	public String getRecommendMan() {
		return this.recommendMan;
	}

	public void setRecommendMan(String recommendMan) {
		this.recommendMan = recommendMan;
	}

	@Column(name = "jobYears")
	public int getJobYears() {
		return this.jobYears;
	}

	public void setJobYears(int jobYears) {
		this.jobYears = jobYears;
	}

	@Column(name = "emergencyMan")
	public String getEmergencyMan() {
		return this.emergencyMan;
	}

	public void setEmergencyMan(String emergencyMan) {
		this.emergencyMan = emergencyMan;
	}

	@Column(name = "emergencyPhone")
	public String getEmergencyPhone() {
		return this.emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone) {
		this.emergencyPhone = emergencyPhone;
	}

	@Column(name = "school")
	public String getSchool() {
		return this.school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	@Column(name = "specialty")
	public String getSpecialty() {
		return this.specialty;
	}

	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}

	@Column(name = "hometownAddress")
	public String getHometownAddress() {
		return this.hometownAddress;
	}

	public void setHometownAddress(String hometownAddress) {
		this.hometownAddress = hometownAddress;
	}

	@Column(name = "address")
	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "isContract")
	public String getIsContract() {
		return this.isContract;
	}

	public void setIsContract(String isContract) {
		this.isContract = isContract;
	}

	@Column(name = "pensionNum")
	public String getPensionNum() {
		return this.pensionNum;
	}

	public void setPensionNum(String pensionNum) {
		this.pensionNum = pensionNum;
	}

	@Column(name = "medicalNum")
	public String getMedicalNum() {
		return this.medicalNum;
	}

	public void setMedicalNum(String medicalNum) {
		this.medicalNum = medicalNum;
	}

	@Column(name = "lover")
	public String getLover() {
		return this.lover;
	}

	public void setLover(String lover) {
		this.lover = lover;
	}

	@Column(name = "bank")
	public String getBank() {
		return this.bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	@Column(name = "bankCardNum")
	public String getBankCardNum() {
		return this.bankCardNum;
	}

	public void setBankCardNum(String bankCardNum) {
		this.bankCardNum = bankCardNum;
	}

	@Column(name = "qq")
	public String getQq() {
		return this.qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	@Column(name = "wechat")
	public String getWechat() {
		return this.wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name = "email")
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "gender")
	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	@Column(name = "height")
	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	@Column(name = "weight")
	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	@Column(name = "political")
	public short getPolitical() {
		return political;
	}

	public void setPolitical(short political) {
		this.political = political;
	}

	@Column(name = "nation")
	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	@Column(name = "hobby")
	public String getHobby() {
		return hobby;
	}

	public void setHobby(String hobby) {
		this.hobby = hobby;
	}

	@Column(name = "isMarried")
	public short getIsMarried() {
		return isMarried;
	}

	public void setIsMarried(short isMarried) {
		this.isMarried = isMarried;
	}

	@Column(name = "isBirth")
	public short getIsBirth() {
		return isBirth;
	}

	public void setIsBirth(short isBirth) {
		this.isBirth = isBirth;
	}

	@Column(name = "isHouseLoan")
	public short getIsHouseLoan() {
		return isHouseLoan;
	}

	public void setIsHouseLoan(short isHouseLoan) {
		this.isHouseLoan = isHouseLoan;
	}

	@Column(name = "isCarLoan")
	public short getIsCarLoan() {
		return isCarLoan;
	}

	public void setIsCarLoan(short isCarLoan) {
		this.isCarLoan = isCarLoan;
	}

	@Column(name = "isCarID")
	public short getIsCarID() {
		return isCarID;
	}

	public void setIsCarID(short isCarID) {
		this.isCarID = isCarID;
	}

	@Column(name = "isPassID")
	public short getIsPassID() {
		return isPassID;
	}

	public void setIsPassID(short isPassID) {
		this.isPassID = isPassID;
	}

	@Column(name = "isHMID")
	public short getIsHMID() {
		return isHMID;
	}

	public void setIsHMID(short isHMID) {
		this.isHMID = isHMID;
	}

	@Column(name = "isTWID")
	public short getIsTWID() {
		return isTWID;
	}

	public void setIsTWID(short isTWID) {
		this.isTWID = isTWID;
	}

	@Column(name = "householdType")
	public short getHouseholdType() {
		return householdType;
	}

	public void setHouseholdType(short householdType) {
		this.householdType = householdType;
	}

	@Column(name = "claner")
	public String getClaner() {
		return claner;
	}

	public void setClaner(String claner) {
		this.claner = claner;
	}

	@Column(name = "clanerCom")
	public String getClanerCom() {
		return clanerCom;
	}

	public void setClanerCom(String clanerCom) {
		this.clanerCom = clanerCom;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fuid", referencedColumnName = "uid")
	public UserPO getFangliner() {
		return fangliner;
	}

	public void setFangliner(UserPO fangliner) {
		this.fangliner = fangliner;
	}

	@Column(name = "firstTime")
	public String getFirstTime() {
		return firstTime;
	}

	public void setFirstTime(String firstTime) {
		this.firstTime = firstTime;
	}

	@Column(name = "entryTime")
	public String getEntryTime() {
		return entryTime;
	}

	public void setEntryTime(String entryTime) {
		this.entryTime = entryTime;
	}

	@Column(name = "employWay")
	public short getEmployWay() {
		return employWay;
	}

	public void setEmployWay(short employWay) {
		this.employWay = employWay;
	}

	@Column(name = "employType")
	public short getEmployType() {
		return employType;
	}

	public void setEmployType(short employType) {
		this.employType = employType;
	}

	@Column(name = "employTime")
	public String getEmployTime() {
		return employTime;
	}

	public void setEmployTime(String employTime) {
		this.employTime = employTime;
	}

	@Column(name = "isPresentGraduate")
	public short getIsPresentGraduate() {
		return isPresentGraduate;
	}

	public void setIsPresentGraduate(short isPresentGraduate) {
		this.isPresentGraduate = isPresentGraduate;
	}

	@Column(name = "graduateTime")
	public String getGraduateTime() {
		return graduateTime;
	}

	public void setGraduateTime(String graduateTime) {
		this.graduateTime = graduateTime;
	}

	@Column(name = "education")
	public short getEducation() {
		return education;
	}

	public void setEducation(short education) {
		this.education = education;
	}

	@Column(name = "signTime")
	public String getSignTime() {
		return signTime;
	}

	public void setSignTime(String signTime) {
		this.signTime = signTime;
	}

	@Column(name = "eignTime")
	public String getEignTime() {
		return eignTime;
	}

	public void setEignTime(String eignTime) {
		this.eignTime = eignTime;
	}

	@Column(name = "fignTime")
	public String getFignTime() {
		return fignTime;
	}

	public void setFignTime(String fignTime) {
		this.fignTime = fignTime;
	}

	@Column(name = "signNum")
	public int getSignNum() {
		return signNum;
	}

	public void setSignNum(int signNum) {
		this.signNum = signNum;
	}

	@Column(name = "preformNum")
	public String getPreformNum() {
		return preformNum;
	}

	public void setPreformNum(String preformNum) {
		this.preformNum = preformNum;
	}

	@Column(name = "formTime")
	public String getFormTime() {
		return formTime;
	}

	public void setFormTime(String formTime) {
		this.formTime = formTime;
	}

	@Column(name = "isInsurance")
	public short getIsInsurance() {
		return isInsurance;
	}

	public void setIsInsurance(short isInsurance) {
		this.isInsurance = isInsurance;
	}

	@Column(name = "insuranceType")
	public short getInsuranceType() {
		return insuranceType;
	}

	public void setInsuranceType(short insuranceType) {
		this.insuranceType = insuranceType;
	}

	@Column(name = "insuranceTime")
	public String getInsuranceTime() {
		return insuranceTime;
	}

	public void setInsuranceTime(String insuranceTime) {
		this.insuranceTime = insuranceTime;
	}

	@Column(name = "publicNum")
	public String getPublicNum() {
		return publicNum;
	}

	public void setPublicNum(String publicNum) {
		this.publicNum = publicNum;
	}

	@Column(name = "palary")
	public String getPalary() {
		return palary;
	}

	public void setPalary(String palary) {
		this.palary = palary;
	}

	@Column(name = "salary")
	public String getSalary() {
		return salary;
	}

	public void setSalary(String salary) {
		this.salary = salary;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "ranks")
	public String getRank() {
		return rank;
	}

	public void setRank(String rank) {
		this.rank = rank;
	}

	@Column(name = "form")
	public short getForm() {
		return form;
	}

	public void setForm(short form) {
		this.form = form;
	}

	@Column(name = "hometownPlace")
	public String getHometownPlace() {
		return hometownPlace;
	}

	public void setHometownPlace(String hometownPlace) {
		this.hometownPlace = hometownPlace;
	}

}