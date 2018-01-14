/**
 * Title: UserVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.DutyVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.vo.RoleVO;

public class UserVO implements Serializable {

	private static final long serialVersionUID = -7041891388073738568L;
	
	private Integer uid;

	private String userId;
	
	private String oldUserId;
	
	private RoleVO role;

	private String companys;
	
	private DepartmentVO dept;
	
	private String loginId;
	
	private String password;
	
	private String userName;
	
	private String userNamePinYin;
	
	private String currentName;
	
	private String status;
	
	private Integer dtid;
	
	private DutyVO duty;
	
	private String gender;
	
	private String birthday;
	
	private String identity;
	
	private String phone;
	
	private String userPhoto;
	
	private Short isLogin;
	
	private Short extranet;
	
	private Short freedom;
	
	private String dutyName;

	public UserVO(){
		super();
	}
	
	public UserVO(String userId){
		super();
		setUserId(userId);
	}

	public UserVO(DutyVO duty) {
		super();
		this.duty = duty;
	}

	public UserVO(String userId, String userName, String currentName, RoleVO role) {
		super();
		this.userId = userId;
		this.role = role;
		this.userName = userName;
		this.currentName = currentName;
	}

	public UserVO(RoleVO role, DepartmentVO dept,DutyVO duty) {
		super();
		this.role = role;
		this.dept = dept;
		this.duty = duty;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

    public String getOldUserId(){
        return oldUserId;
    }

    public void setOldUserId(String oldUserId){
        this.oldUserId = oldUserId;
    }

	public RoleVO getRole(){
		return role;
	}

	public void setRole(RoleVO role){
		this.role = role;
	}

	public DepartmentVO getDept(){
		return dept;
	}

	public void setDept(DepartmentVO dept){
		this.dept = dept;
	}

	public String getLoginId(){
		return loginId;
	}

	public void setLoginId(String loginId){
		this.loginId = loginId;
	}

	public String getPassword(){
		return password;
	}

	public void setPassword(String password){
		this.password = password;
	}

	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	public String getUserNamePinYin(){
		return userNamePinYin;
	}

	public void setUserNamePinYin(String userNamePinYin){
		this.userNamePinYin = userNamePinYin;
	}

	public String getCurrentName(){
		return currentName;
	}

	public void setCurrentName(String currentName){
		this.currentName = currentName;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

    public Integer getDtid() {
		return dtid;
	}

	public void setDtid(Integer dtid) {
		this.dtid = dtid;
	}

	public DutyVO getDuty(){
		return duty;
	}

	public void setDuty(DutyVO duty){
		this.duty = duty;
	}

	public String getGender(){
		return gender;
	}

	public void setGender(String gender){
		this.gender = gender;
	}

	public String getBirthday(){
		return birthday;
	}

	public void setBirthday(String birthday){
		this.birthday = birthday;
	}

	public String getIdentity(){
		return identity;
	}

	public void setIdentity(String identity){
		this.identity = identity;
	}

	public String getPhone(){
		return phone;
	}

	public void setPhone(String phone){
		this.phone = phone;
	}

	public String getUserPhoto(){
		return userPhoto;
	}

	public void setUserPhoto(String userPhoto){
		this.userPhoto = userPhoto;
	}

    public Short getIsLogin(){
        return isLogin;
    }

    public void setIsLogin(Short isLogin){
        this.isLogin = isLogin;
    }

	public Short getExtranet() {
		return extranet;
	}

	public void setExtranet(Short extranet) {
		this.extranet = extranet;
	}

	public Short getFreedom() {
		return freedom;
	}

	public void setFreedom(Short freedom) {
		this.freedom = freedom;
	}

	public String getCompanys() {
		return companys;
	}

	public void setCompanys(String companys) {
		this.companys = companys;
	}
	
	
	public String getDutyName() {
		return dutyName;
	}

	public void setDutyName(String dutyName) {
		this.dutyName = dutyName;
	}

	public UserVO setBaseInfo(UserPO userPO){
			
			if(userPO != null){
				setUid(userPO.getUid());
				setUserId(userPO.getUserId());
				setCurrentName(userPO.getCurrentName());
				setUserName(userPO.getUserName());
				setUserPhoto(userPO.getUserPhoto());
				setPhone(userPO.getPhone());
				setDutyName(userPO.getDuty().getName());
			}
			
			return this;
		}
		
}
