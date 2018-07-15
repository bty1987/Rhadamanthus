/**
 * Title: UserPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.system.po.RolePO;

@Entity
@Table(name = "user", catalog = "communion")
public class UserPO implements Serializable {

	private static final long serialVersionUID = -7041891388073738568L;
	
	public static final String SUPER_USERID_STR = "1";
	
	public static final short ISLOGIN_NOT_INT = 0;
	
	public static final short ISLOGIN_FIP_INT = 1;
	
	public static final short ISLOGIN_FS_INT = 2;
	
	public static final short FREEDOM_TIMEOUT_INT = 1;
	
	public static final short FREEDOM_ROLLCALL_INT = 2;
	
	public static final short FREEDOM_REQUEST_AUTH_INT = 4;
	
	public static final short STATUS_ENABLE_INT = 0;
		
	public static final short STATUS_DISABLE_INT = 1;
	
	private int uid;

	private String userId;
	
	private String oldUserId;
	
	private RolePO role;
	
	private DepartmentPO dept;
	
	private int company;
	
	private String loginId;
	
	private String password;
	
	private String userName;
	
	private String pinYin;
	
	private String currentName;
	
	private short status;
	
	private int dtid;
	
	private DutyPO duty;
	
	private String gender;
	
	private String birthday;
	
	private String identity;
	
	private String phone;
	
	private String userPhoto;
	
	private short isLogin;
	
	private short extranet;
	
	private short freedom;

	public UserPO(){
		super();
	}
	
	public UserPO(int uid) {
		super();
		this.uid = uid;
	}

	public UserPO(String userId){
		this.userId = userId;
	}
	
	public UserPO(DutyPO duty) {
		super();
		this.duty = duty;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uId") 
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}
	
	@Column(name = "userId")
	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	@Column(name = "oldUserId")
    public String getOldUserId(){
        return oldUserId;
    }
   
    public void setOldUserId(String oldUserId){
        this.oldUserId = oldUserId;
    }
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "roleId", referencedColumnName = "rid", nullable = false)
	public RolePO getRole(){
		return role;
	}

	public void setRole(RolePO role){
		this.role = role;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deptId", referencedColumnName = "did", nullable = false)
	public DepartmentPO getDept(){
		return dept;
	}
	
	public void setDept(DepartmentPO dept){
		this.dept = dept;
	}

	@Column(name = "loginId")
	public String getLoginId(){
		return loginId;
	}

	public void setLoginId(String loginId){
		this.loginId = loginId;
	}

	@Column(name = "password")
	public String getPassword(){
		return password;
	}

	public void setPassword(String password){
		this.password = password;
	}

	@Column(name = "userName")
	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	@Column(name = "pinYin")
	public String getPinYin() {
		return pinYin;
	}

	public void setPinYin(String pinYin) {
		this.pinYin = pinYin;
	}

	@Column(name = "currentName")
	public String getCurrentName(){
		return currentName;
	}

	public void setCurrentName(String currentName){
		this.currentName = currentName;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "dtid")
    public int getDtid() {
		return dtid;
	}

	
	public void setDtid(int dtid) {
		this.dtid = dtid;
	}

    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did", nullable = false)
	public DutyPO getDuty(){
		return duty;
	}

	public void setDuty(DutyPO duty){
		this.duty = duty;
	}

	@Column(name = "gender")
	public String getGender(){
		return gender;
	}

	public void setGender(String gender){
		this.gender = gender;
	}

	@Column(name = "birthday")
	public String getBirthday(){
		return birthday;
	}

	public void setBirthday(String birthday){
		this.birthday = birthday;
	}

	@Column(name = "identity")
	public String getIdentity(){
		return identity;
	}

	public void setIdentity(String identity){
		this.identity = identity;
	}

	@Column(name = "phone")
	public String getPhone(){
		return phone;
	}

	public void setPhone(String phone){
		this.phone = phone;
	}

	@Column(name = "userPhoto")
	public String getUserPhoto(){
		return userPhoto;
	}

	public void setUserPhoto(String userPhoto){
		this.userPhoto = userPhoto;
	}

	@Column(name = "isLogin")
    public short getIsLogin(){
        return isLogin;
    }

    public void setIsLogin(short isLogin){
        this.isLogin = isLogin;
    }

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "extranet")
	public short getExtranet() {
		return extranet;
	}

	public void setExtranet(short extranet) {
		this.extranet = extranet;
	}

	public short getFreedom() {
		return freedom;
	}

	public void setFreedom(short freedom) {
		this.freedom = freedom;
	}

}
