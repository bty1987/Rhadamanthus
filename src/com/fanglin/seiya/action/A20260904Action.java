/**
 * @File Name		: A20260904Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-09-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 库存数据同步（辅材/仓库/出入库）
 */

package com.fanglin.seiya.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.seiya.service.A20260904Service;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20260904Action extends BaseListAction {

	private static final long serialVersionUID = 20260904L;

	@Autowired
	private A20260904Service a20260904Service;

	// ==================== 请求参数 ====================

	/** 货号（业务唯一键，公司维度，对应 goods.no） */
	private String no;

	/** 名称（辅材/仓库名称） */
	private String name;

	/** 计量单位（可选） */
	private String measurementUnit;

	/** 定额单位（可选） */
	private String normunit;

	/** 定额数量（可选） */
	private Integer normnum;

	/** 库房单位（可选） */
	private String storeunit;

	/** 库房数量（可选） */
	private Integer storenum;

	/** 辅材分类ID（可选） */
	private Long atid;

	/** 仓库编号（唯一键） */
	private String code;

	/** 仓库状态（0 启用/1 停用，可选） */
	private Integer status;

	/** 仓库编号（出入库接口） */
	private String storehouseCode;

	/** 出入库类型：in 入库 / out 出库 */
	private String type;

	/** 数量（>0） */
	private Integer num;

	/** 单据时间（可选，yyyy-MM-dd HH:mm:ss） */
	private String manifestTime;

	/** 备注（可选） */
	private String comment;

	/** 公司ID */
	private Integer company;

	// ==================== 响应字段 ====================

	/**
	 * 返回字段 - data对象，封装处理结果
	 */
	private Map<String, Object> data;

	/**
	 * 同步辅材档案接口
	 *
	 * 以货号(no)为业务键：商品不存在则创建商品（含默认颜色/规格）+ 辅材档案，存在则更新
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncAoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncAoods() throws FLException {

		// 参数必填验证
		if (no == null || no.trim().isEmpty()) {
			throw new FLException(400035, "辅材货号不能为空");
		}
		if (name == null || name.trim().isEmpty()) {
			throw new FLException(400003, "商品名称不能为空");
		}
		if (company == null) {
			throw new FLException(400024, "公司ID不能为空");
		}

		// 调用服务层处理
		Map<String, Object> result = a20260904Service.syncAoods(no.trim(), name.trim(), measurementUnit, normunit, normnum, storeunit, storenum, atid, company);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * 同步仓库档案接口
	 *
	 * 以仓库编号(code)为业务键：不存在则创建，存在则更新名称/状态
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncStorehouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncStorehouse() throws FLException {

		// 参数必填验证
		if (code == null || code.trim().isEmpty()) {
			throw new FLException(400036, "仓库编号不能为空");
		}
		if (name == null || name.trim().isEmpty()) {
			throw new FLException(400043, "仓库名称不能为空");
		}

		// 调用服务层处理
		Map<String, Object> result = a20260904Service.syncStorehouse(code.trim(), name.trim(), status);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * 同步出入库接口（含 manifest 单据信息）
	 *
	 * type=in 入库：库存行不存在自动创建并累加；type=out 出库：库存行不存在或不足直接拒绝
	 * 每次调用生成一张 manifest 单据（in=CG 进货 / out=XG 出货）+ 明细，单事务失败整体回滚
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncStorehouseStock", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncStorehouseStock() throws FLException {

		// 参数必填验证
		if (no == null || no.trim().isEmpty()) {
			throw new FLException(400035, "辅材货号不能为空");
		}
		if (storehouseCode == null || storehouseCode.trim().isEmpty()) {
			throw new FLException(400036, "仓库编号不能为空");
		}
		if (type == null || (!"in".equals(type.trim()) && !"out".equals(type.trim()))) {
			throw new FLException(400039, "出入库类型无效");
		}
		if (num == null || num <= 0) {
			throw new FLException(400005, "数量必须大于0");
		}
		if (company == null) {
			throw new FLException(400024, "公司ID不能为空");
		}

		String userId = querySyncUserId();

		if (userId == null || userId.trim().isEmpty()) {
			throw new FLException(400040, "操作账号无效");
		}

		// 调用服务层处理
		Map<String, Object> result = a20260904Service.syncStorehouseStock(no.trim(), storehouseCode.trim(), type.trim(), num, manifestTime, comment, company, userId);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * 取库存同步操作账号
	 *
	 * queryUserId() 优先（认证串为完整登录态格式时可解出 userId）；
	 * 为 null 时按 AccessInterceptor through=2 语义将 authentication 解密明文视为 userId（认证串为纯账号加密串的场景）
	 */
	private String querySyncUserId() throws FLException {

		String userId = queryUserId();

		if (userId == null || userId.trim().isEmpty()) {

			String authentication = request.getParameter("authentication");

			if (authentication != null) {

				String decryptString = AESHelper.decrypt(authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

				if (decryptString != null && !decryptString.trim().isEmpty()) {
					userId = decryptString.trim();
				}
			}
		}

		return userId;
	}

	// ==================== Getter and Setter ====================

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	public Integer getNormnum() {
		return normnum;
	}

	public void setNormnum(Integer normnum) {
		this.normnum = normnum;
	}

	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	public Integer getStorenum() {
		return storenum;
	}

	public void setStorenum(Integer storenum) {
		this.storenum = storenum;
	}

	public Long getAtid() {
		return atid;
	}

	public void setAtid(Long atid) {
		this.atid = atid;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getStorehouseCode() {
		return storehouseCode;
	}

	public void setStorehouseCode(String storehouseCode) {
		this.storehouseCode = storehouseCode;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public String getManifestTime() {
		return manifestTime;
	}

	public void setManifestTime(String manifestTime) {
		this.manifestTime = manifestTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
