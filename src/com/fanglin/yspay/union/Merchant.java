/**
 * @File Name		: Information.java
 * @Package   	: com.fanglin.yspay.union
 * @Version		: 1.0
 * @Date			: 2021-1-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.yspay.union;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SimplePropertyPreFilter;
import com.fanglin.core.interceptor.FLException;

public class Merchant implements Serializable {

	private static final long serialVersionUID = 194229634300622305L;

	private String userCode;

	private String ysUserCode;

	private String custname;

	private String custflag;

	private String custAnotherName;

	private String certifitype;

	private String certifino;

	private String certifiEffect;

	private String certifiDate;

	private String mobile;

	private String email;

	private String notifyType;

	private String province;

	private String city;

	private String area;

	private String companyNo; // 企业证照号

	private String companyAddress; // 公司地址

	private String companyCerttype; // 企业证照类型

	private String legalname; // 法人姓名

	private String contactPhone; // 法人电话

	private String bsLicenseEffect; // 企业证件生效日期 , 选填

	private String validtime; // 企业证件截止日期 , 选填

	private String settleAccountType;

	private String bankname; // 银行名

	private String bankCerNo; // 银行卡号

	private String banktype;

	private String bankMobile;

	private String bankProvinc;

	private String bankCity;

	private String bankCerType;

	private String bankAccountNo;

	private String bankAccountName;

	private String bankAccountType;

	private List<String> picIds;

	private String state;

	private Base base;

	private List<String> keys;

	public Merchant() {
		super();

		setBase(new Base());
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;

		getKeys().add("userCode");
	}

	public String getYsUserCode() {
		return ysUserCode;
	}

	public void setYsUserCode(String ysUserCode) {
		this.ysUserCode = ysUserCode;

		getKeys().add("ysUserCode");
	}

	public String getCustname() {
		return custname;
	}

	public void setCustname(String custname) {
		this.custname = custname;

		getKeys().add("custname");
	}

	public String getCustAnotherName() {
		return custAnotherName;
	}

	public void setCustAnotherName(String custAnotherName) {
		this.custAnotherName = custAnotherName;

		getKeys().add("custAnotherName");
	}

	public String getCertifitype() {
		return certifitype;
	}

	public void setCertifitype(String certifitype) {
		this.certifitype = certifitype;

		getKeys().add("certifitype");
	}

	public String getCertifino() {
		return certifino;
	}

	public void setCertifino(String certifino) {
		this.certifino = certifino;

		getKeys().add("certifino");
	}

	public String getCertifiEffect() {
		return certifiEffect;
	}

	public void setCertifiEffect(String certifiEffect) {
		this.certifiEffect = certifiEffect;

		getKeys().add("certifiEffect");
	}

	public String getCertifiDate() {
		return certifiDate;
	}

	public void setCertifiDate(String certifiDate) {
		this.certifiDate = certifiDate;

		getKeys().add("certifiDate");
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;

		getKeys().add("mobile");
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;

		getKeys().add("email");
	}

	public String getNotifyType() {
		return notifyType;
	}

	public void setNotifyType(String notifyType) {
		this.notifyType = notifyType;

		getKeys().add("notifyType");
	}

	public String getCustflag() {
		return custflag;
	}

	public void setCustflag(String custflag) {
		this.custflag = custflag;

		getKeys().add("custflag");
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;

		getKeys().add("province");
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;

		getKeys().add("city");
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;

		getKeys().add("area");
	}

	public String getCompanyNo() {
		return companyNo;
	}

	public void setCompanyNo(String companyNo) {
		this.companyNo = companyNo;

		getKeys().add("companyNo");
	}

	public String getCompanyAddress() {
		return companyAddress;
	}

	public void setCompanyAddress(String companyAddress) {
		this.companyAddress = companyAddress;

		getKeys().add("companyAddress");
	}

	public String getCompanyCerttype() {
		return companyCerttype;
	}

	public void setCompanyCerttype(String companyCerttype) {
		this.companyCerttype = companyCerttype;

		getKeys().add("companyCerttype");
	}

	public String getLegalname() {
		return legalname;
	}

	public void setLegalname(String legalname) {
		this.legalname = legalname;

		getKeys().add("legalname");
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;

		getKeys().add("contactPhone");
	}

	public String getBsLicenseEffect() {
		return bsLicenseEffect;
	}

	public void setBsLicenseEffect(String bsLicenseEffect) {
		this.bsLicenseEffect = bsLicenseEffect;

		getKeys().add("bsLicenseEffect");
	}

	public String getValidtime() {
		return validtime;
	}

	public void setValidtime(String validtime) {
		this.validtime = validtime;

		getKeys().add("validtime");
	}

	public String getSettleAccountType() {
		return settleAccountType;
	}

	public void setSettleAccountType(String settleAccountType) {
		this.settleAccountType = settleAccountType;

		getKeys().add("settleAccountType");
	}

	public String getBankname() {
		return bankname;
	}

	public void setBankname(String bankname) {
		this.bankname = bankname;

		getKeys().add("bankname");
	}

	public String getBankCerNo() {
		return bankCerNo;
	}

	public void setBankCerNo(String bankCerNo) {
		this.bankCerNo = bankCerNo;

		getKeys().add("bankCerNo");
	}

	public String getBanktype() {
		return banktype;
	}

	public void setBanktype(String banktype) {
		this.banktype = banktype;

		getKeys().add("banktype");
	}

	public String getBankMobile() {
		return bankMobile;
	}

	public void setBankMobile(String bankMobile) {
		this.bankMobile = bankMobile;

		getKeys().add("bankMobile");
	}

	public String getBankProvinc() {
		return bankProvinc;
	}

	public void setBankProvinc(String bankProvinc) {
		this.bankProvinc = bankProvinc;

		getKeys().add("bankProvinc");
	}

	public String getBankCity() {
		return bankCity;
	}

	public void setBankCity(String bankCity) {
		this.bankCity = bankCity;

		getKeys().add("bankCity");
	}

	public String getBankCerType() {
		return bankCerType;
	}

	public void setBankCerType(String bankCerType) {
		this.bankCerType = bankCerType;

		getKeys().add("bankCerType");
	}

	public String getBankAccountNo() {
		return bankAccountNo;
	}

	public void setBankAccountNo(String bankAccountNo) {
		this.bankAccountNo = bankAccountNo;

		getKeys().add("bankAccountNo");
	}

	public String getBankAccountName() {
		return bankAccountName;
	}

	public void setBankAccountName(String bankAccountName) {
		this.bankAccountName = bankAccountName;

		getKeys().add("bankAccountName");
	}

	public String getBankAccountType() {
		return bankAccountType;
	}

	public void setBankAccountType(String bankAccountType) {
		this.bankAccountType = bankAccountType;

		getKeys().add("bankAccountType");
	}

	public List<String> getPicIds() {
		return picIds;
	}

	public void setPicIds(List<String> picIds) {
		this.picIds = picIds;

		getKeys().add("picIds");
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@JSONField(serialize = false)
	public Base getBase() {
		return base;
	}

	public void setBase(Base base) {
		this.base = base;
	}

	public List<String> getKeys() {
		return keys;
	}

	public void setKeys(List<String> keys) {
		this.keys = keys;
	}

	private void initKeys() {
		setKeys(new ArrayList<String>());
	}

	public Merchant mini() {
		setCustflag("2"); // 2: 小微 , 3: 个体 , 4: 企业
		return this;
	}

	public Merchant personal() {
		setCustflag("3"); // 2: 小微 , 3: 个体 , 4: 企业
		return this;
	}

	public Merchant company() {
		setCustflag("4"); // 2: 小微 , 3: 个体 , 4: 企业
		return this;
	}

	public Merchant merchant(String no, String name, String aname, String certifino, String certifiEffect, String certifiVerify, String mobile, String email) {

		setUserCode(no);
		setCustname(name);
		setCustAnotherName(aname);
		setCertifino(certifino);
		setCertifiEffect(certifiEffect);
		setCertifiDate(certifiVerify);
		setMobile(mobile);
		setEmail(email);

		setCertifitype("00"); // 00: 身份证

		return this;
	}

	public Merchant company(String province, String city, String area, String address, String no, String certtype, String effect, String valid, String legalname, String legalphone) {

		setProvince(province);
		setCity(city);
		setArea(area);
		setCompanyAddress(address);
		setCompanyNo(no);
		setCompanyCerttype(certtype);

		setLegalname(legalname);
		setContactPhone(legalphone);

		setBsLicenseEffect(effect);
		setValidtime(valid);

		return this;
	}

	public Merchant bank(String bankNo, String bankName, String bankMobile, String provinc, String city, String accountName, String accountType, String certifino, String accountype) {

		setBankProvinc(provinc);
		setBankCity(city);
		setBankAccountNo(bankNo);
		setBankAccountName(accountName);
		setBankAccountType(accountType);
		setBankCerNo(certifino);
		setBankCerType("00"); // 00: 身份证
		setBankname(bankName);
		setBankMobile(bankMobile);

		setSettleAccountType(accountype);

		return this;
	}

	public Merchant query(String userCode) throws FLException {

		initKeys();

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Merchant.class, getKeys().toArray(new String[getKeys().size()]));

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "merchantQuery", "/api/query/merchant/registry");

		return JSONObject.toJavaObject(response, Merchant.class);
	}

	public Merchant regist(List<String> picIds) throws FLException {

		initKeys();

		setPicIds(picIds);

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Merchant.class, getKeys().toArray(new String[getKeys().size()]));

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "merchantRegistry", "/api/merchant/merchantRegistry");

		return JSONObject.toJavaObject(response, Merchant.class);
	}

	public static void main(String[] args) {

	}

}
