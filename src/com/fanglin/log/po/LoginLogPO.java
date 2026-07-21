package com.fanglin.log.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "loginLog", catalog = "log")
public class LoginLogPO implements Serializable {

	private static final long serialVersionUID = -8993777631048468332L;

	// ===== successFlag 枚举（向后兼容，保留二态）=====
	/** 登录失败 */
	public static final int SUCCESSFLAG_FAIL = 0;
	/** 登录成功 */
	public static final int SUCCESSFLAG_SUCCESS = 1;

	// ===== resultState 三态（Phase 8 新增，与 ActionLogPO 对齐）=====
	/** 结果状态：成功 */
	public static final short RESULTSTATE_SUCCESS = 0;
	/** 结果状态：业务失败（密码错/验证码错等） */
	public static final short RESULTSTATE_FAIL = 1;
	/** 结果状态：系统异常（非 FLException） */
	public static final short RESULTSTATE_ERROR = 2;

	// ===== operateType 登录方式枚举 ======
	/** 密码登录（含挑战-响应） */
	public static final String OPERATETYPE_PASSWORD = "PASSWORD";
	/** 验证码登录（requestAuthCode） */
	public static final String OPERATETYPE_AUTHCODE = "AUTHCODE";
	/** 手机验证码登录（phoneAuthCode） */
	public static final String OPERATETYPE_PHONE = "PHONE";
	/** 切换公司（changeAuthCode） */
	public static final String OPERATETYPE_CHANGE = "CHANGE";
	/** 刷新令牌（updateAuthCode） */
	public static final String OPERATETYPE_UPDATE = "UPDATE";

	private long llId;

	private String id;

	private String loginId;

	private Timestamp loginTime;

	private String sourceIp;

	private int successFlag;

	// ===== Phase 8 扩展字段 =====
	private String operateType;
	private Short resultState;
	private Integer errorCode;
	private String errorMsg;
	private Integer companyId;
	private String traceId;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "llId")
	public long getLlId(){
		return llId;
	}

	public void setLlId(long llId){
		this.llId = llId;
	}

	@Column(name = "id")
	public String getId(){
		return id;
	}

	public void setId(String id){
		this.id = id;
	}

	@Column(name = "loginId")
	public String getLoginId(){
		return loginId;
	}

	public void setLoginId(String loginId){
		this.loginId = loginId;
	}

	@Column(name = "loginTime")
	public Timestamp getLoginTime(){
		return loginTime;
	}

	public void setLoginTime(Timestamp loginTime){
		this.loginTime = loginTime;
	}

	@Column(name = "sourceIp")
	public String getSourceIp(){
		return sourceIp;
	}

	public void setSourceIp(String sourceIp){
		this.sourceIp = sourceIp;
	}

	@Column(name = "successFlag")
	public int getSuccessFlag(){
		return successFlag;
	}

	public void setSuccessFlag(int successFlag){
		this.successFlag = successFlag;
	}

	@Column(name = "operateType")
	public String getOperateType(){
		return operateType;
	}

	public void setOperateType(String operateType){
		this.operateType = operateType;
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

	@Column(name = "companyId")
	public Integer getCompanyId(){
		return companyId;
	}

	public void setCompanyId(Integer companyId){
		this.companyId = companyId;
	}

	@Column(name = "traceId")
	public String getTraceId(){
		return traceId;
	}

	public void setTraceId(String traceId){
		this.traceId = traceId;
	}

}
