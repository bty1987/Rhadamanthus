package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "recruitment", catalog = "communion")
public class RecruitmentPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_ENTRY_INT = 1;// 入职

	public static final short STATUS_CANCEL_INT = 2;// 作废

	public static final short EMPLOYWAY_CAMPUS_INT = 0;// 校园招聘

	public static final short EMPLOYWAY_NETWORK_INT = 1;// 网络招聘

	public static final short EMPLOYWAY_INSIDEI_INT = 2;// 内部推荐

	public static final short EMPLOYWAY_ACTIVE_INT = 3;// 主动应聘

	public static final short EMPLOYWAY_HEADHUNTING_INT = 4;// 猎头

	public static final short POLITICAL_MASSES_INT = 0;// 群众

	public static final short POLITICAL_TEAM_INT = 1;// 团员

	public static final short POLITICAL_PARTY_INT = 2;// 党员

	private long rid;

	private String name;

	private String identity;

	private String nation;

	private String place;

	private int weight;

	private int height;

	private short employWay;

	private short householdType;

	private short political;

	private short education;

	private String phone;

	private String wechat;

	private String qq;

	private String address;

	private String nativePlace;

	private String hometownPlace;

	private String specialty;

	private String emergencyMan;

	private String emergencyPhone;

	private short isMarried;

	private short isBirth;

	private short isHouse;

	private short isCar;

	private short isHouseLoan;

	private short isCarLoan;

	private short isCarID;

	private short isPassID;

	private short isHMID;

	private short isTWID;

	private short isContract;

	private short isSnsurance;

	private short isFire;

	private short isCnsurance;

	private short isCompete;

	private short isTrain;

	private short isCriminal;

	private short isDisease;

	private short status;

	private String photoPath;

	private String identityPathF;

	private String identityPathB;

	public RecruitmentPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "identity")
	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	@Column(name = "nation")
	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	@Column(name = "place")
	public String getPlace() {
		return place;
	}

	public void setPlace(String place) {
		this.place = place;
	}

	@Column(name = "weight")
	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	@Column(name = "height")
	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	@Column(name = "employWay")
	public short getEmployWay() {
		return employWay;
	}

	public void setEmployWay(short employWay) {
		this.employWay = employWay;
	}

	@Column(name = "householdType")
	public short getHouseholdType() {
		return householdType;
	}

	public void setHouseholdType(short householdType) {
		this.householdType = householdType;
	}

	@Column(name = "political")
	public short getPolitical() {
		return political;
	}

	public void setPolitical(short political) {
		this.political = political;
	}

	@Column(name = "education")
	public short getEducation() {
		return education;
	}

	public void setEducation(short education) {
		this.education = education;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "wechat")
	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name = "qq")
	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "nativePlace")
	public String getNativePlace() {
		return nativePlace;
	}

	public void setNativePlace(String nativePlace) {
		this.nativePlace = nativePlace;
	}

	@Column(name = "hometownPlace")
	public String getHometownPlace() {
		return hometownPlace;
	}

	public void setHometownPlace(String hometownPlace) {
		this.hometownPlace = hometownPlace;
	}

	@Column(name = "specialty")
	public String getSpecialty() {
		return specialty;
	}

	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}

	@Column(name = "emergencyMan")
	public String getEmergencyMan() {
		return emergencyMan;
	}

	public void setEmergencyMan(String emergencyMan) {
		this.emergencyMan = emergencyMan;
	}

	@Column(name = "emergencyPhone")
	public String getEmergencyPhone() {
		return emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone) {
		this.emergencyPhone = emergencyPhone;
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

	@Column(name = "isHouse")
	public short getIsHouse() {
		return isHouse;
	}

	public void setIsHouse(short isHouse) {
		this.isHouse = isHouse;
	}

	@Column(name = "isCar")
	public short getIsCar() {
		return isCar;
	}

	public void setIsCar(short isCar) {
		this.isCar = isCar;
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

	@Column(name = "isContract")
	public short getIsContract() {
		return isContract;
	}

	public void setIsContract(short isContract) {
		this.isContract = isContract;
	}

	@Column(name = "isSnsurance")
	public short getIsSnsurance() {
		return isSnsurance;
	}

	public void setIsSnsurance(short isSnsurance) {
		this.isSnsurance = isSnsurance;
	}

	@Column(name = "isFire")
	public short getIsFire() {
		return isFire;
	}

	public void setIsFire(short isFire) {
		this.isFire = isFire;
	}

	@Column(name = "isCnsurance")
	public short getIsCnsurance() {
		return isCnsurance;
	}

	public void setIsCnsurance(short isCnsurance) {
		this.isCnsurance = isCnsurance;
	}

	@Column(name = "isCompete")
	public short getIsCompete() {
		return isCompete;
	}

	public void setIsCompete(short isCompete) {
		this.isCompete = isCompete;
	}

	@Column(name = "isTrain")
	public short getIsTrain() {
		return isTrain;
	}

	public void setIsTrain(short isTrain) {
		this.isTrain = isTrain;
	}

	@Column(name = "isCriminal")
	public short getIsCriminal() {
		return isCriminal;
	}

	public void setIsCriminal(short isCriminal) {
		this.isCriminal = isCriminal;
	}

	@Column(name = "isDisease")
	public short getIsDisease() {
		return isDisease;
	}

	public void setIsDisease(short isDisease) {
		this.isDisease = isDisease;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "photoPath")
	public String getPhotoPath() {
		return photoPath;
	}

	public void setPhotoPath(String photoPath) {
		this.photoPath = photoPath;
	}

	@Column(name = "identityPathF")
	public String getIdentityPathF() {
		return identityPathF;
	}

	public void setIdentityPathF(String identityPathF) {
		this.identityPathF = identityPathF;
	}

	@Column(name = "identityPathB")
	public String getIdentityPathB() {
		return identityPathB;
	}

	public void setIdentityPathB(String identityPathB) {
		this.identityPathB = identityPathB;
	}
}
