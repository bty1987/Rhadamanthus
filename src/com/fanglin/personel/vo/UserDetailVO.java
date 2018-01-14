package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;


public class UserDetailVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4710972275402194538L;

	private String userId;
	
	private String userName;
	
	private Integer roleId;
	
	private String roleName;
	
	private Integer cityId;
	
	private String tel;
	
	private String email;
	
	private Integer storefrontId;
	
	private Integer departmentId;
	
	private String qq;
	
	private Timestamp birthday;
	
	private Timestamp joinTime;
	
	private Integer outFlag;
	
	private Timestamp outTime;
	
	private String password;

	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	public Integer getRoleId(){
		return roleId;
	}

	public void setRoleId(Integer roleId){
		this.roleId = roleId;
	}

	public String getRoleName(){
		return roleName;
	}

	public void setRoleName(String roleName){
		this.roleName = roleName;
	}

	public Integer getCityId(){
		return cityId;
	}

	public void setCityId(Integer cityId){
		this.cityId = cityId;
	}

	public String getTel(){
		return tel;
	}

	public void setTel(String tel){
		this.tel = tel;
	}

	public String getEmail(){
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public Integer getStorefrontId(){
		return storefrontId;
	}

	public void setStorefrontId(Integer storefrontId){
		this.storefrontId = storefrontId;
	}

	public Integer getDepartmentId(){
		return departmentId;
	}

	public void setDepartmentId(Integer departmentId){
		this.departmentId = departmentId;
	}

	public String getQq(){
		return qq;
	}

	public void setQq(String qq){
		this.qq = qq;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getBirthday(){
		return birthday;
	}

	public void setBirthday(Timestamp birthday){
		this.birthday = birthday;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getJoinTime(){
		return joinTime;
	}

	public void setJoinTime(Timestamp joinTime){
		this.joinTime = joinTime;
	}

	public Integer getOutFlag(){
		return outFlag;
	}

	public void setOutFlag(Integer outFlag){
		this.outFlag = outFlag;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getOutTime(){
		return outTime;
	}

	public void setOutTime(Timestamp outTime){
		this.outTime = outTime;
	}

	public String getPassword(){
		return password;
	}

	public void setPassword(String password){
		this.password = password;
	}

	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	
}
