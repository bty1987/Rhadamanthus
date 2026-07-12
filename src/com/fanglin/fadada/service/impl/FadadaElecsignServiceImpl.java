package com.fanglin.fadada.service.impl;

import java.io.File;
import java.util.List;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.SignetPO;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.elecsign.bean.Contract;
import com.fanglin.fadada.signature.Signature;
import com.fanglin.elecsign.vo.SignatureVO;

/**
 * 法大大电子签实现。
 *
 * <p>本类是 {@link ElecsignService} 的法大大适配器，本身不含业务逻辑——
 * 每个方法都直接转调既有静态工具类 {@link Signature}（原逻辑一行不动）。
 * 这样做的好处：
 * <ul>
 *   <li>正在运行的法大大核心代码（{@code Signature.java}、{@code fadada.properties}、
 *       加密加载逻辑）完全不受影响。</li>
 *   <li>业务方依赖 {@link ElecsignService} 接口后，由路由器选择注入本实现还是
 *       {@code ESignElecsignServiceImpl}，切换厂商对调用方透明。</li>
 * </ul>
 *
 * <p><b>错误码说明</b>：法大大不同接口返回码不统一（部分判 {@code code==1}，
 * 部分判 {@code "1000".equals(code)}），本类完全保留 {@link Signature} 的原始判断，
 * 不做统一化重构，保证行为 100% 等价。
 *
 * @see Signature
 */
@Service("fadadaElecsignService")
public class FadadaElecsignServiceImpl implements ElecsignService {

	// ====================================================================================
	// 一、企业实名认证（印章主体）
	// ====================================================================================

	@Override
	public void register(SignetPO signetPO) throws FLException {
		Signature.register(signetPO);
	}

	@Override
	public String authenticate(SignetPO signetPO) throws FLException {
		return Signature.authenticate(signetPO);
	}

	@Override
	public void company(SignetPO signetPO) throws FLException {
		Signature.company(signetPO);
	}

	@Override
	public String beforeauto(SignetPO signetPO) throws FLException {
		return Signature.beforeauto(signetPO);
	}

	// ====================================================================================
	// 二、个人实名认证（客户/员工）
	// ====================================================================================

	@Override
	public String register(String no) throws FLException {
		return Signature.register(no);
	}

	@Override
	public JSONObject authenticate(String signno, String name, String phone, String identity, short type) throws FLException {
		return Signature.authenticate(signno, name, phone, identity, type);
	}

	@Override
	public JSONObject person(String token) throws FLException {
		return Signature.person(token);
	}

	@Override
	public void certificate(String no, String token) throws FLException {
		Signature.certificate(no, token);
	}

	// ====================================================================================
	// 三、印章 / 签名图片管理
	// ====================================================================================

	@Override
	public List<SignatureVO> query(SignatureVO signatureVO) throws FLException {
		return Signature.query(signatureVO);
	}

	@Override
	public SignatureVO add(SignatureVO signatureVO) throws FLException {
		return Signature.add(signatureVO);
	}

	@Override
	public void defaults(SignatureVO signatureVO) throws FLException {
		Signature.defaults(signatureVO);
	}

	@Override
	public void delete(SignatureVO signatureVO) throws FLException {
		Signature.delete(signatureVO);
	}

	@Override
	public void signature(String signno, String path) throws FLException {
		Signature.signature(signno, path);
	}

	// ====================================================================================
	// 四、合同模板 / 生成 / 上传
	// ====================================================================================

	@Override
	public void template(String templateId, File file, String url) throws FLException {
		Signature.template(templateId, file, url);
	}

	@Override
	public void generate(Contract contract, JSONObject json, JSONArray tables) throws FLException {
		Signature.generate(contract, json, tables);
	}

	@Override
	public void upload(Contract contract, String path) throws FLException {
		Signature.upload(contract, path);
	}

	// ====================================================================================
	// 五、签署（自动签 / 手动签）
	// ====================================================================================

	@Override
	public void autosign(String signno, String keyword, Contract contract) throws FLException {
		Signature.autosign(signno, keyword, contract);
	}

	@Override
	public void autosign(String signno, String keyword, Contract contract, String signatureId) throws FLException {
		Signature.autosign(signno, keyword, contract, signatureId);
	}

	@Override
	public void autosign(String signno, String keyword, Contract contract, String signatureId, String keywordStrategy) throws FLException {
		Signature.autosign(signno, keyword, contract, signatureId, keywordStrategy);
	}

	@Override
	public void autosign(String signno, Contract contract, String signatureId, double x, double y) throws FLException {
		Signature.autosign(signno, contract, signatureId, x, y);
	}

	@Override
	public String extsign(String signno, Contract contract) {
		return Signature.extsign(signno, contract);
	}

	// ====================================================================================
	// 六、预览 / 下载 / 归档
	// ====================================================================================

	@Override
	public String view(Contract contract) {
		return Signature.view(contract);
	}

	@Override
	public String download(Contract contract) {
		return Signature.download(contract);
	}

	@Override
	public void filing(Contract contract) throws FLException {
		Signature.filing(contract);
	}

	@Override
	public String getFile(String uuid) {
		return Signature.getFile(uuid);
	}

	// ====================================================================================
	// 七、工具方法透传
	// ====================================================================================

	@Override
	public String decode(String bizContent) {
		return Signature.decode(bizContent);
	}
}
