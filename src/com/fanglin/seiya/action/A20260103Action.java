/**
 * @File Name     : A20260103Action.java
 * @Package       : com.fanglin.seiya.action
 * @Version       : 1.0
 * @Date          : 2025-01-03
 * @Copyright     : Copyright Creators 2025
 * @Author        : Fanglin ERP Team
 * @Email         : support@fanglin.com
 * @Describing    : 2026-01-03 接口控制器 - 客户线索接入
 */

package com.fanglin.seiya.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20260103Action extends BaseListAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8282907716768305249L;

	@Autowired
	private CustomerChanceService customerChanceService;

	/**
	 * 线索编码 - 对应 customerChance.cno
	 */
	private String leadCode;

	/**
	 * 尺源编码 - 对应 source.no
	 */
	private String adornCode;

	/**
	 * 客户名称 - 对应 source.name
	 */
	private String name;

	/**
	 * 客户电话 - 对应 source.phone
	 */
	private String phone;

	/**
	 * 客户性别 - 对应 source.gender
	 */
	private String gender;

	/**
	 * 楼盘名称 - 对应 village.name
	 */
	private String village;

	/**
	 * 楼号 - 对应 house.houseNumber
	 */
	private String houseNumber;

	/**
	 * 面积 - 对应 house.area
	 */
	private Integer buildArea;

	/**
	 * 业务类型 - 对应 busitype.dbid
	 */
	private Long busitype;

	/**
	 * 公司标识 - AES加密后的公司ID
	 */
	private String orgId;

	/**
	 * 添加客户线索接口
	 * 
	 * 接收外部系统传入的客户线索信息，转换为 ERP 客户机会并创建
	 * 
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "addCustomerLead", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerLead() throws FLException {

		CustomerChanceVO customerChanceVO = new CustomerChanceVO();

		// 1. 客户机会编号
		customerChanceVO.setCno(leadCode);

		// 2. 业务类型
		customerChanceVO.setBusitype(new DecorationBusitypeVO(this.busitype));

		// 3. 客户资源
		CustomerSourceVO source = new CustomerSourceVO();

		// 客户资源编号
		source.setNo(adornCode);

		// 客户基本信息
		source.setName(name);
		source.setPhone(phone);
		source.setGender(gender);

		// 楼盘信息
		VillageVO villageVO = new VillageVO();
		villageVO.setName(village);
		source.setVillage(villageVO);

		// 房产信息
		HouseVO houseVO = new HouseVO();
		houseVO.setHouseNumber(houseNumber);
		houseVO.setBuildArea(buildArea);
		source.setHouse(houseVO);

		// 客户对象
		source.setCustomer(new CustomerVO());

		// 业务类型
		source.setBusitype(customerChanceVO.getBusitype());

		customerChanceVO.setSource(source);

		// 4. 调用 CustomerChanceService
		customerChanceService.addCustomerChance(customerChanceVO, queryUserId(), queryCompany());

		return SUCCESS;
	}

	// ==================== Getter and Setter ====================

	public String getLeadCode() {
		return leadCode;
	}

	public void setLeadCode(String leadCode) {
		this.leadCode = leadCode;
	}

	public String getAdornCode() {
		return adornCode;
	}

	public void setAdornCode(String adornCode) {
		this.adornCode = adornCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getVillage() {
		return village;
	}

	public void setVillage(String village) {
		this.village = village;
	}

	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	public Integer getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(Integer buildArea) {
		this.buildArea = buildArea;
	}

	public Long getBusitype() {
		return busitype;
	}

	public void setBusitype(Long busitype) {
		this.busitype = busitype;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

}
