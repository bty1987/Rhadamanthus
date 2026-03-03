/**
 * @File Name		: A20260303Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-03-03
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: Village楼盘数据同步
 */

package com.fanglin.seiya.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20260303Service;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20260303Action extends BaseListAction {

	private static final long serialVersionUID = 20260303L;

	@Autowired
	private A20260303Service a20260303Service;

	// ==================== 请求参数 ====================
	/** 楼盘ID（更新时使用，新增时为空） */
	private String vid;

	/** 楼盘名称 */
	private String name;

	/** 区域名称（如：铁西区） */
	private String proper;

	/** 城市名称（如：沈阳市） */
	private String city;

	/** 父级楼盘ID（可为空） */
	private String pvid;

	/** 公司ID */
	private Integer company;

	/** 规则数组（JSON字符串格式） */
	private String rule;

	// ==================== 响应字段 ====================
	/** 错误码 0:成功 */
	private Integer errorCode = 0;

	/** 错误信息 */
	private String errorMsg;

	/** 条件信息 */
	private String condition;

	/** 返回数据对象 */
	private Map<String, Object> data;

	/**
	 * 同步楼盘数据接口
	 *
	 * 请求参数示例（表单格式）：
	 * vid=
	 * name=万科城市花园
	 * proper=铁西区
	 * city=沈阳市
	 * pvid=
	 * company=1
	 * rule=[{"rule":"\\d#\\d-\\d","comment":"数字#数字-数字"}]
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncVillageData", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,vid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncVillageData() throws FLException {

		// 初始化 data 对象
		this.data = new HashMap<String, Object>();

		// 参数必填验证
		if (name == null || name.trim().isEmpty()) {
			throw new FLException(400001, "楼盘名称不能为空");
		}
		if (city == null || city.trim().isEmpty()) {
			throw new FLException(400002, "城市名称不能为空");
		}
		if (proper == null || proper.trim().isEmpty()) {
			throw new FLException(400003, "区域名称不能为空");
		}

		// 解析 rule 参数（JSON 字符串）
		JSONArray ruleArray = null;
		if (rule != null && !rule.trim().isEmpty()) {
			try {
				ruleArray = JSONArray.parseArray(rule);
			} catch (Exception e) {
				throw new FLException(400004, "规则格式不正确，必须是JSON数组格式");
			}
		}

		// 调用服务层处理
		Map<String, Object> result = a20260303Service.syncVillage(vid, name, proper, city, pvid, company, ruleArray);

		this.data.putAll(result);

		// 将返回的vid赋值给请求参数，作为响应结果
		Object resultVid = result.get("vid");
		if (resultVid != null) {
			this.vid = String.valueOf(resultVid);
		}

		return SUCCESS;
	}

	// ==================== Getter and Setter ====================

	public String getVid() {
		return vid;
	}

	public void setVid(String vid) {
		this.vid = vid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProper() {
		return proper;
	}

	public void setProper(String proper) {
		this.proper = proper;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPvid() {
		return pvid;
	}

	public void setPvid(String pvid) {
		this.pvid = pvid;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	public Integer getErrorCode() {
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

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
