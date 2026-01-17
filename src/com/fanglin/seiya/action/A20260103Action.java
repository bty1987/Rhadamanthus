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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.json.annotations.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.DepartmentService;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.service.CustomerDeptRuleService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerDeptRuleVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.service.DecorationBusitypeService;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;

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

	@Autowired
	private DepartmentService departmentService;

	@Autowired
	private CustomerDeptRuleService customerDeptRuleService;

	@Autowired
	private UserService userService;

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
	 * 业务类型 - 对应 busitype.name
	 */
	private String busitype;

	private String userId;

	/**
	 * 设计师userId - 当部门规则为3:派到设计师时需要传
	 */
	private String designerId;

	/**
	 * 部门Id - 当部门规则为2:派到设计部门时需要传
	 */
	private Integer departmentId;

	/**
	 * 分区Id - 当部门规则为1:派到设计分区时需要传
	 */
	private Integer regionId;

	/**
	 * 公司标识 - AES加密后的公司ID
	 */
	private Integer orgId;

	/**
	 * 返回字段 - 老ERP系统机会编码
	 */
	private String erpJhCode;

	/**
	 * 返回字段 - 老ERP设计师分派人编码(工号 如FL-xxx)
	 */
	private String erpAssignerCode;

	/**
	 * 返回字段 - 老ERP设计师编码(工号 如FL-xxx)
	 */
	private String erpDesignerCode;

	/**
	 * 返回字段 - 派尺时间
	 */
	private String issusTime;

	/**
	 * 返回字段 - 装修单编码（原orderId）
	 */
	private String erpZxdCode;

	/**
	 * 返回字段 - data对象，封装请求参数
	 */
	private Map<String, Object> data;

	// ==================== 通用响应字段 ====================
	/** 错误码 0:成功 */
	private Integer errorCode = 0;
	/** 错误信息 */
	private String errorMsg;
	/** 条件信息 */
	private String condition;

	// ==================== queryDepartment 相关字段 ====================
	private String deptName; // 部门名称（支持模糊匹配）
	private String deptType; // 部门类型 1:设计分区 2:设计部门
	private List<SimpleDepartmentVO> simpleDeptList; // 简化部门列表（用于SF接口返回）

	// ==================== queryUserByPinyin 相关字段 ====================
	private UserVO user;
	private String pinyinName;
	private DepartmentTypeVO departmentType;
	private List<SimpleUserVO> simpleUserList; // 简化用户列表（用于SF接口返回）
	private String userStatus; // 人员状态 0:在职 1:离职

	// ==================== queryCustomerDeptRuleByDbidForSF 相关字段 ====================
	private CustomerDeptRuleVO customerDeptRuleVO;
	private Integer ruleId; // 部门规则类型 0:派到公司 1:派到设计分区 2:派到设计部门 3:派到设计师

	@Autowired
	private DecorationBusitypeService decorationBusitypeService;

	/**
	 * 添加客户线索接口
	 *
	 * 接收外部系统传入的客户线索信息，转换为 ERP 客户机会并创建
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "addCustomerLead", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "condition,errorCode,errorMsg,data.*" })
	}, params = { "contentType", "text/html" })
	public String addCustomerLead() throws FLException {

		// 初始化 data 对象（在方法开始处，确保即使出错也有返回值）
		this.data = new HashMap<String, Object>();

		CustomerChanceVO customerChanceVO = new CustomerChanceVO();

		// 1. 客户机会编号
		customerChanceVO.setCno(leadCode);

		// 2. 业务类型
		if (busitype == null) {
			busitype = "电商信息流客源";
		}

		UserVO creater = userService.queryUserByUserId(new UserVO(userId));

		if (creater == null) {
			throw new FLException(190005, "人员不存在");
		}

		DecorationBusitypeVO busitypeVO = new DecorationBusitypeVO();
		busitypeVO.setName(busitype);
		busitypeVO = decorationBusitypeService.queryDecorationBusitypeByName(busitypeVO, creater.getCompanyNo());

		if (busitypeVO == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		customerChanceVO.setBusitype(new DecorationBusitypeVO(busitypeVO.getDbid())) ;

		// 3. 客户资源
		CustomerSourceVO source = new CustomerSourceVO();

		// 客户资源编号
		source.setNo(adornCode);

		// 客户基本信息
		source.setName(name);
		source.setPhone(phone);
		source.setGender(gender);

		// 楼盘信息
		source.setVillage(new VillageVO(village));

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

		// 设置设计师/部门/分区（根据部门规则）
		// 规则3: 派到设计师
		if (designerId != null && !designerId.trim().isEmpty()) {
			customerChanceVO.setBelonger(new UserBaseVO(designerId));
		}
		// 规则2: 派到设计部门
		if (departmentId != null) {
			DepartmentVO department = new DepartmentVO();
			department.setDid(departmentId);
			customerChanceVO.setDepartment(department);
		}
		// 规则1: 派到设计分区
		if (regionId != null) {
			DepartmentVO region = new DepartmentVO();
			region.setDid(regionId);
			customerChanceVO.setRegion(region);
		}

		// 4. 调用 CustomerChanceService
		CustomerChanceVO result = customerChanceService.addCustomerChance(customerChanceVO, userId, orgId);

		// 5. 设置返回参数（外层字段）
		if (result != null) {
			// 老ERP系统机会编码
			if (result.getCcid() != null) {
				this.erpJhCode = String.valueOf(result.getCcid());
			}

			// 老ERP设计师分派人编码(工号 如FL-xxx)
			if (result.getIssuer() != null && result.getIssuer().getUserId() != null) {
				this.erpAssignerCode = result.getIssuer().getUserId();
			}

			// 老ERP设计师编码(工号 如FL-xxx)
			if (result.getBelonger() != null && result.getBelonger().getUserId() != null) {
				this.erpDesignerCode = result.getBelonger().getUserId();
			}

			// 派尺时间
			if (result.getIssueTime() != null) {
				this.issusTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(result.getIssueTime());
			}

			// 装修单编码
			if (result.getOrderId() != null) {
				this.erpZxdCode = result.getOrderId();
			}
		}

		// 封装 data 对象（包含请求参数和返回结果）
		// 请求参数
		this.data.put("leadCode", leadCode);
		this.data.put("adornCode", adornCode);
		this.data.put("name", name);
		this.data.put("phone", phone);
		this.data.put("gender", gender);
		this.data.put("village", village);
		this.data.put("houseNumber", houseNumber);
		this.data.put("buildArea", buildArea / 1000.0);
		this.data.put("busitype", busitype);
		this.data.put("userId", userId);
		this.data.put("orgId", orgId);
		this.data.put("designerId", designerId);
		this.data.put("departmentId", departmentId);
		this.data.put("regionId", regionId);
		// 返回结果
		this.data.put("erpJhCode", erpJhCode);
		this.data.put("erpAssignerCode", erpAssignerCode);
		this.data.put("erpDesignerCode", erpDesignerCode);
		this.data.put("issusTime", issusTime);
		this.data.put("erpZxdCode", erpZxdCode);

		return SUCCESS;
	}

	/**
	 * 查询部门列表接口（重写）
	 *
	 * 请求参数：
	 * - orgId: 信息平台编码，即公司标识（ERP中communion.company.cid加密）
	 * - deptType: 部门类型（1:设计分区，2:设计部门）
	 * - deptName: 部门名称（支持模糊匹配）
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryDepartmentByNameForSF", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,data.*" })
	}, params = { "contentType", "text/html" })
	public String queryDepartmentByNameForSF() throws FLException {

		// 初始化 data 对象
		this.data = new HashMap<String, Object>();

		// 构建 DepartmentVO 查询条件
		DepartmentVO queryDept = new DepartmentVO();

		// 设置部门类型（1:设计分区，2:设计部门）
		if (deptType != null && !deptType.trim().isEmpty()) {
			DepartmentTypeVO type = new DepartmentTypeVO();
			type.setDtid(Integer.parseInt(deptType.trim()));
			queryDept.setType(type);
		}

		List<DepartmentVO> deptList;

		// 根据deptName是否存在决定调用哪个接口
		if (deptName == null || deptName.trim().isEmpty()) {
			// deptName为空时，调用queryDepartmentByDtid接口
			deptList = departmentService.queryDepartmentByDtid(queryDept, orgId);
		} else {
			// deptName不为空时，调用queryDepartmentByName接口
			queryDept.setName(deptName.trim());
			deptList = departmentService.queryDepartmentByName(queryDept, orgId);
		}

		// 转换为简化格式并放入 data
		List<SimpleDepartmentVO> resultList = new ArrayList<SimpleDepartmentVO>();
		if (deptList != null && !deptList.isEmpty()) {
			for (DepartmentVO dept : deptList) {
				SimpleDepartmentVO simple = new SimpleDepartmentVO();
				simple.setId(dept.getDid() != null ? String.valueOf(dept.getDid()) : null);
				simple.setName(dept.getName());
				resultList.add(simple);
			}
		}
		this.data.put("simpleDeptList", resultList);

		return SUCCESS;
	}

	/**
	 * 根据拼音查询用户接口（重写）
	 *
	 * 请求参数：
	 * - pinyinName: 设计师名称（支持模糊匹配）
	 * - userStatus: 人员状态 0:在职 1:离职
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryUserByPinyinForSF", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,data.*" })
	}, params = { "contentType", "text/html" })
	public String queryUserByPinyinForSF() throws FLException {

		// 初始化 data 对象
		this.data = new HashMap<String, Object>();

		// 设置人员状态查询条件
		if (userStatus != null && !userStatus.trim().isEmpty()) {
			if (user == null) {
				user = new UserVO();
			}
			user.setStatus(Short.parseShort(userStatus.trim()));
		}

		// 查询用户列表
		List<UserBaseVO> users = userService.queryUserByPinyin(pinyinName, user, departmentType, orgId);

		// 转换为简化格式并放入 data
		List<SimpleUserVO> resultList = new ArrayList<SimpleUserVO>();
		if (users != null && !users.isEmpty()) {
			for (UserBaseVO u : users) {
				SimpleUserVO simple = new SimpleUserVO();
				simple.setId(u.getUid() != null ? String.valueOf(u.getUid()) : null);
				simple.setCode(u.getUserId());
				simple.setName(u.getCurrentName());
				resultList.add(simple);
			}
		}
		this.data.put("simpleUserList", resultList);

		return SUCCESS;
	}

	/**
	 * 根据部门ID和业务类型dbid查询客户部门规则接口（SF专用）
	 *
	 * 请求参数：
	 * - orgId: 信息平台编码，即公司标识（ERP中communion.company.cid加密）
	 * - userId: 约访专员工号（如FL-123456）
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryCustomerDeptRuleByDbidForSF", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,data.*" })
	}, params = { "contentType", "text/html" })
	public String queryCustomerDeptRuleByDbidForSF() throws FLException {

		// 初始化 data 对象
		this.data = new HashMap<String, Object>();

		// 使用默认业务类型：电商信息流客源
		String defaultBusitype = "电商信息流客源";

		// 查询业务类型
		DecorationBusitypeVO busitypeVO = new DecorationBusitypeVO();
		busitypeVO.setName(defaultBusitype);
		busitypeVO = decorationBusitypeService.queryDecorationBusitypeByName(busitypeVO, CompanyServiceImpl.encode(orgId));

		if (busitypeVO == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		// 根据工号查询用户
		UserVO creater = userService.queryUserByUserId(new UserVO(userId));

		if (creater == null) {
			throw new FLException(190005, "人员不存在");
		}

		// 构建查询条件
		CustomerDeptRuleVO queryVO = new CustomerDeptRuleVO();
		DepartmentVO departmentVO = new DepartmentVO();
		departmentVO.setDid(creater.getDept().getDid());
		queryVO.setDepartment(departmentVO);
		queryVO.setBusitype(busitypeVO);

		// 查询客户部门规则
		this.customerDeptRuleVO = customerDeptRuleService.queryCustomerDeptRuleByDbid(queryVO);

		// 检查规则是否存在
		if (this.customerDeptRuleVO == null) {
			throw new FLException(130062, "部门规则不存在");
		}

		// 设置规则类型（0:派到公司 1:派到设计分区 2:派到设计部门 3:派到设计师）并放入 data
		this.ruleId = this.customerDeptRuleVO.getType().intValue();
		this.data.put("ruleId", this.ruleId);

		return SUCCESS;
	}

	// ==================== Getter and Setter ====================

	@JSON(serialize = false)
	public String getLeadCode() {
		return leadCode;
	}

	public void setLeadCode(String leadCode) {
		this.leadCode = leadCode;
	}

	@JSON(serialize = false)
	public String getAdornCode() {
		return adornCode;
	}

	public void setAdornCode(String adornCode) {
		this.adornCode = adornCode;
	}

	@JSON(serialize = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JSON(serialize = false)
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@JSON(serialize = false)
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@JSON(serialize = false)
	public String getVillage() {
		return village;
	}

	public void setVillage(String village) {
		this.village = village;
	}

	@JSON(serialize = false)
	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	@JSON(serialize = false)
	public Integer getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(Integer buildArea) {
		this.buildArea = buildArea;
	}

	@JSON(serialize = false)
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@JSON(serialize = false)
	public String getDesignerId() {
		return designerId;
	}

	public void setDesignerId(String designerId) {
		this.designerId = designerId;
	}

	@JSON(serialize = false)
	public Integer getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Integer departmentId) {
		this.departmentId = departmentId;
	}

	@JSON(serialize = false)
	public Integer getRegionId() {
		return regionId;
	}

	public void setRegionId(Integer regionId) {
		this.regionId = regionId;
	}

	@JSON(serialize = false)
	public String getErpJhCode() {
		return erpJhCode;
	}

	public void setErpJhCode(String erpJhCode) {
		this.erpJhCode = erpJhCode;
	}

	@JSON(serialize = false)
	public Integer getOrgId() {
		return orgId;
	}

	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}

	@JSON(serialize = false)
	public String getErpAssignerCode() {
		return erpAssignerCode;
	}

	public void setErpAssignerCode(String erpAssignerCode) {
		this.erpAssignerCode = erpAssignerCode;
	}

	@JSON(serialize = false)
	public String getErpDesignerCode() {
		return erpDesignerCode;
	}

	public void setErpDesignerCode(String erpDesignerCode) {
		this.erpDesignerCode = erpDesignerCode;
	}

	@JSON(serialize = false)
	public String getIssusTime() {
		return issusTime;
	}

	public void setIssusTime(String issusTime) {
		this.issusTime = issusTime;
	}

	@JSON(serialize = false)
	public String getErpZxdCode() {
		return erpZxdCode;
	}

	public void setErpZxdCode(String erpZxdCode) {
		this.erpZxdCode = erpZxdCode;
	}

	@JSON(serialize = false)
	public String getBusitype() {
		return busitype;
	}

	public void setBusitype(String busitype) {
		this.busitype = busitype;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

	// ==================== 通用响应字段 Getter and Setter ====================

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(Integer errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	// ==================== queryDepartment Getter and Setter ====================

	@JSON(serialize = false)
	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@JSON(serialize = false)
	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	// ==================== queryUserByPinyin Getter and Setter ====================

	@JSON(serialize = false)
	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	@JSON(serialize = false)
	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

	@JSON(serialize = false)
	public DepartmentTypeVO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypeVO departmentType) {
		this.departmentType = departmentType;
	}

	@JSON(serialize = false)
	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	// ==================== queryCustomerDeptRuleByDbidForSF Getter and Setter ====================

	@JSON(serialize = false)
	public CustomerDeptRuleVO getCustomerDeptRuleVO() {
		return customerDeptRuleVO;
	}

	public void setCustomerDeptRuleVO(CustomerDeptRuleVO customerDeptRuleVO) {
		this.customerDeptRuleVO = customerDeptRuleVO;
	}

	@JSON(serialize = false)
	public Integer getRuleId() {
		return ruleId;
	}

	public void setRuleId(Integer ruleId) {
		this.ruleId = ruleId;
	}

	// ==================== SimpleDepartmentVO Getter and Setter ====================

	@JSON(serialize = false)
	public List<SimpleDepartmentVO> getSimpleDeptList() {
		return simpleDeptList;
	}

	public void setSimpleDeptList(List<SimpleDepartmentVO> simpleDeptList) {
		this.simpleDeptList = simpleDeptList;
	}

	// ==================== SimpleUserVO Getter and Setter ====================

	@JSON(serialize = false)
	public List<SimpleUserVO> getSimpleUserList() {
		return simpleUserList;
	}

	public void setSimpleUserList(List<SimpleUserVO> simpleUserList) {
		this.simpleUserList = simpleUserList;
	}

	/**
	 * 简化部门VO（用于SF接口返回）
	 * 只包含 id 和 name 两个字段
	 */
	public static class SimpleDepartmentVO implements java.io.Serializable {

		private static final long serialVersionUID = 1L;

		private String id;
		private String name;

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 简化用户VO（用于SF接口返回）
	 * 只包含 id、code 和 name 三个字段
	 */
	public static class SimpleUserVO implements java.io.Serializable {

		private static final long serialVersionUID = 1L;

		private String id;
		private String code;
		private String name;

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

}
