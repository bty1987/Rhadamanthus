package com.fanglin.elecsign.service;

import java.io.File;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.elecsign.bean.Contract;
import com.fanglin.elecsign.vo.SignatureVO;
import com.fanglin.data.po.SignetPO;

/**
 * 电子签统一服务接口（厂商中立）。
 *
 * <p>本接口是电子签多厂商（法大大 / e签宝）的统一抽象层。业务方依赖本接口，
 * 由 {@code ElecsignRouter} 按公司配置路由到具体厂商实现：
 * <ul>
 *   <li>{@code FadadaElecsignServiceImpl}：转调现有 {@code Signature} 静态方法（逻辑不变）</li>
 *   <li>{@code ESignElecsignServiceImpl}：调用 e签宝 SDK（后续阶段新增）</li>
 * </ul>
 *
 * <h3>设计原则</h3>
 * <ul>
 *   <li><b>方法签名严格对齐现有 {@code Signature.java}</b>，保证法大大实现下沉时零语义改动、
 *       业务方替换调用点时零入参改动。</li>
 *   <li>入参复用既有业务模型（{@link Signet}/{@link Contract}/{@link SignatureVO} + 基本类型），
 *       不外泄任何厂商 SDK 类型（如法大大的 {@code ExtSignAutoParams}）。
 *       这样切换厂商时调用方代码无需改动。</li>
 *   <li>异常沿用项目统一的 {@link FLException}（法大大各方法的错误码保持原样）。</li>
 * </ul>
 *
 * <p>方法分组与 {@code Signature.java} 的对应关系见各方法 Javadoc 的「对应」标注。
 *
 * @see com.fanglin.fadada.signature.Signature
 */
public interface ElecsignService {

	// ====================================================================================
	// 签章关键字匹配策略（厂商中立常量，值与法大大现有 Signature.KEYWORD_STRATEGY_* 保持一致）
	// 原定义：Signature.KEYWORD_STRATEGY_ALL_STR="0" / FIRST="1" / LAST="2"
	// ====================================================================================

	/** 所有匹配位置都盖章 */
	String KEYWORD_STRATEGY_ALL_STR = "0";

	/** 第一个匹配位置盖章 */
	String KEYWORD_STRATEGY_FIRST_STR = "1";

	/** 最后一个匹配位置盖章 */
	String KEYWORD_STRATEGY_LAST_STR = "2";

	// ====================================================================================
	// 一、企业实名认证（印章主体）
	// 对应 Signature.register(SignetPO) / authenticate(SignetPO) / company(SignetPO) / beforeauto(SignetPO)
	// ====================================================================================

	/**
	 * 注册企业客户账号。
	 * <p>对应 {@code Signature.register(SignetPO)}：注册成功后将返回的客户编号写回 {@code signetPO.signno}。
	 */
	void register(SignetPO signetPO) throws FLException;

	/**
	 * 获取企业实名认证 URL。
	 * <p>对应 {@code Signature.authenticate(SignetPO)}：将认证交易号、认证URL写回 signetPO，并返回 URL。
	 */
	String authenticate(SignetPO signetPO) throws FLException;

	/**
	 * 查询企业实名认证结果。
	 * <p>对应 {@code Signature.company(SignetPO)}：认证未通过抛 {@link FLException}。
	 */
	void company(SignetPO signetPO) throws FLException;

	/**
	 * 授权自动签（企业签署授权书）。
	 * <p>对应 {@code Signature.beforeauto(SignetPO)}：返回厂商原始结果串。
	 */
	String beforeauto(SignetPO signetPO) throws FLException;

	// ====================================================================================
	// 二、个人实名认证（客户/员工）
	// 对应 Signature.register(String) / authenticate(String,...) / person(String) / certificate(String,String)
	// ====================================================================================

	/**
	 * 注册个人客户账号。
	 * <p>对应 {@code Signature.register(String)}：返回厂商个人客户编号。
	 */
	String register(String no) throws FLException;

	/**
	 * 获取个人实名认证信息（厂商返回的原始 JSON，含认证 URL 等）。
	 * <p>对应 {@code Signature.authenticate(String signno, String name, String phone, String identity, short type)}。
	 *
	 * @param signno   厂商个人客户编号
	 * @param name     姓名
	 * @param phone    手机号
	 * @param identity 证件号
	 * @param type     证件类型（0 身份证 / 1 护照，与现有语义一致）
	 */
	JSONObject authenticate(String signno, String name, String phone, String identity, short type) throws FLException;

	/**
	 * 查询个人实名认证结果。
	 * <p>对应 {@code Signature.person(String token)}：返回厂商原始 JSON，未通过抛 {@link FLException}。
	 */
	JSONObject person(String token) throws FLException;

	/**
	 * 申请证书。
	 * <p>对应 {@code Signature.certificate(String no, String token)}。
	 */
	void certificate(String no, String token) throws FLException;

	// ====================================================================================
	// 三、印章 / 签名图片管理
	// 对应 Signature.query/add/defaults/delete(SignatureVO) / signature(String,String)
	// ====================================================================================

	/** 查询印章列表。对应 {@code Signature.query(SignatureVO)}。 */
	List<SignatureVO> query(SignatureVO signatureVO) throws FLException;

	/** 添加印章。对应 {@code Signature.add(SignatureVO)}。 */
	SignatureVO add(SignatureVO signatureVO) throws FLException;

	/** 设默认印章。对应 {@code Signature.defaults(SignatureVO)}。 */
	void defaults(SignatureVO signatureVO) throws FLException;

	/** 删除印章。对应 {@code Signature.delete(SignatureVO)}。 */
	void delete(SignatureVO signatureVO) throws FLException;

	/**
	 * 按图片公网地址为客户/员工添加签名章。
	 * <p>对应 {@code Signature.signature(String signno, String path)}。
	 */
	void signature(String signno, String path) throws FLException;

	// ====================================================================================
	// 四、合同模板 / 生成 / 上传
	// 对应 Signature.template / generate / upload
	// ====================================================================================

	/**
	 * 上传合同模板。
	 * <p>对应 {@code Signature.template(String templateId, File file, String url)}：file/url 至少传一个。
	 */
	void template(String templateId, File file, String url) throws FLException;

	/**
	 * 按模板生成合同。
	 * <p>对应 {@code Signature.generate(Contract, JSONObject, JSONArray)}：
	 * 成功后将下载/预览 URL 写回 contract。
	 *
	 * @param contract 合同载体（提供 templateCode/contentCode/title，接收 download/viewpdf）
	 * @param json     模板变量填充内容（json 字符串对象）
	 * @param tables   动态表格，可为 null
	 */
	void generate(Contract contract, JSONObject json, JSONArray tables) throws FLException;

	/**
	 * 上传 PDF 合同文档。
	 * <p>对应 {@code Signature.upload(Contract, String path)}：成功后将下载/预览 URL 写回 contract。
	 */
	void upload(Contract contract, String path) throws FLException;

	// ====================================================================================
	// 五、签署（自动签 / 手动签）
	// 对应 Signature.autosign / extsign
	// ====================================================================================

	/** 关键字自动签（默认策略=所有）。对应 {@code Signature.autosign(String,String,Contract)}。 */
	void autosign(String signno, String keyword, Contract contract) throws FLException;

	/** 关键字自动签（指定印章，默认策略=所有）。对应 {@code Signature.autosign(String,String,Contract,String)}。 */
	void autosign(String signno, String keyword, Contract contract, String signatureId) throws FLException;

	/** 关键字自动签（指定印章+策略）。对应 {@code Signature.autosign(String,String,Contract,String,String)}。 */
	void autosign(String signno, String keyword, Contract contract, String signatureId, String keywordStrategy) throws FLException;

	/** 坐标自动签。对应 {@code Signature.autosign(String,Contract,String,double,double)}。 */
	void autosign(String signno, Contract contract, String signatureId, double x, double y) throws FLException;

	/**
	 * 发起手动签署。
	 * <p>对应 {@code Signature.extsign(String, Contract)}：返回厂商签署 URL 给客户/员工。
	 */
	String extsign(String signno, Contract contract);

	// ====================================================================================
	// 六、预览 / 下载 / 归档
	// 对应 Signature.view / download / filing / getFile
	// ====================================================================================

	/** 获取预览 URL。对应 {@code Signature.view(Contract)}。 */
	String view(Contract contract);

	/** 获取下载 URL。对应 {@code Signature.download(Contract)}。 */
	String download(Contract contract);

	/**
	 * 合同归档。
	 * <p>对应 {@code Signature.filing(Contract)}：成功后置 {@code contract.status(STATUS_FILING_INT)}。
	 */
	void filing(Contract contract) throws FLException;

	/**
	 * 按 UUID 下载认证文件（认证图片 / 企业申请表）。
	 * <p>对应 {@code Signature.getFile(String uuid)}：返回厂商结果串。
	 */
	String getFile(String uuid);

	// ====================================================================================
	// 七、静态工具方法透传（与签署流程无关，供工具场景调用）
	// ====================================================================================

	/**
	 * URL 解码 + Base64 解码（法大大现有 {@code Signature.decode} 语义）。
	 * <p>注意：这是厂商相关的解码，e签宝实现按需返回原文。
	 */
	String decode(String bizContent);
}
