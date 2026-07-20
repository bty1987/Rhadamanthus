/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.log.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "actionLog", catalog = "log")
public class ActionLogPO implements Serializable {

	private static final long serialVersionUID = -1714740524313501162L;

	/** 结果状态：成功 */
	public static final short RESULTSTATE_SUCCESS = 0;
	/** 结果状态：业务失败（FLException 上抛） */
	public static final short RESULTSTATE_FAIL = 1;
	/** 结果状态：系统异常（非 FLException） */
	public static final short RESULTSTATE_ERROR = 2;

	private long alId;

	private String actionName;

	private UserPO createUserPO;

	private Timestamp  createTime;

	private long runTime;

	// ===== Phase 1 扩展字段（DB 列允许 NULL，存量兼容）=====
	private String ip;            // 来源 IP
	private Integer companyId;    // 所属公司
	private String moduleId;      // 业务模块（包名最后一段，decoration/quotation/...）
	private String operateType;   // 操作类型 ADD/UPDATE/DELETE/QUERY/EXPORT/LOGIN/OTHER
	private String businessId;    // 业务对象主键
	private String params;        // 请求参数 JSON（脱敏后）
	private Short resultState;    // 0成功 1失败 2异常
	private Integer errorCode;    // FLException 错误码
	private String errorMsg;      // 错误消息
	private String traceId;       // 链路追踪 ID

	public ActionLogPO(){
		super();
	}

	public ActionLogPO(String actionName, UserPO createUserPO, Timestamp createTime, long runTime){
		super();
		this.actionName = actionName;
		this.createUserPO = createUserPO;
		this.createTime = createTime;
		this.runTime = runTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "alId")
	public long getAlId() {
		return alId;
	}

	public void setAlId(long alId) {
		this.alId = alId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createUserId", referencedColumnName = "userId")
	public UserPO getCreateUserPO(){
		return createUserPO;
	}
	
	public void setCreateUserPO(UserPO createUserPO){
		this.createUserPO = createUserPO;
	}
	
	@Column(name = "createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}
	
	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}
	
	@Column(name = "actionName")
	public void setActionName(String actionName){
		this.actionName = actionName;
	}
	
	public String getActionName(){
		return actionName;
	}

	@Column(name = "runTime")
	public long getRunTime(){
		return runTime;
	}

	public void setRunTime(long runTime){
		this.runTime = runTime;
	}

	@Column(name = "ip")
	public String getIp(){
		return ip;
	}

	public void setIp(String ip){
		this.ip = ip;
	}

	@Column(name = "companyId")
	public Integer getCompanyId(){
		return companyId;
	}

	public void setCompanyId(Integer companyId){
		this.companyId = companyId;
	}

	@Column(name = "moduleId")
	public String getModuleId(){
		return moduleId;
	}

	public void setModuleId(String moduleId){
		this.moduleId = moduleId;
	}

	@Column(name = "operateType")
	public String getOperateType(){
		return operateType;
	}

	public void setOperateType(String operateType){
		this.operateType = operateType;
	}

	@Column(name = "businessId")
	public String getBusinessId(){
		return businessId;
	}

	public void setBusinessId(String businessId){
		this.businessId = businessId;
	}

	@Column(name = "params")
	public String getParams(){
		return params;
	}

	public void setParams(String params){
		this.params = params;
	}

	@Column(name = "resultState")
	public Short getResultState(){
		return resultState;
	}

	public void setResultState(Short resultState){
		this.resultState = resultState;
	}

	@Column(name = "errorCode")
	public Integer getErrorCode(){
		return errorCode;
	}

	public void setErrorCode(Integer errorCode){
		this.errorCode = errorCode;
	}

	@Column(name = "errorMsg")
	public String getErrorMsg(){
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg){
		this.errorMsg = errorMsg;
	}

	@Column(name = "traceId")
	public String getTraceId(){
		return traceId;
	}

	public void setTraceId(String traceId){
		this.traceId = traceId;
	}
}
