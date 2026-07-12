/**
 * @File Name		: SecretAction.java
 * @Package   	: com.fanglin.system.action
 * @Version		: 1.0
 * @Date			: 2017-8-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.fadada.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.fadada.vo.SignatureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FadadaAction extends BaseListAction {

	private static final long serialVersionUID = 1988424215935977023L;

	@Autowired
	private ElecsignService elecsignService;

	private SignatureVO signature;

	private List<SignatureVO> signatures;

	@Action(value = "pollingSignature", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pollingSignature() throws FLException {

		signatures = elecsignService.query(signature);

		return SUCCESS;
	}

	@Action(value = "defaultSignature", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String defaultSignature() throws FLException {

		elecsignService.defaults(signature);

		return SUCCESS;
	}

	@Action(value = "addSignature", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSignature() throws FLException {

		signature = elecsignService.add(signature);

		return SUCCESS;
	}

	@Action(value = "deleteSignature", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSignature() throws FLException {

		elecsignService.delete(signature);

		return SUCCESS;
	}

	public SignatureVO getSignature() {
		return signature;
	}

	public void setSignature(SignatureVO signature) {
		this.signature = signature;
	}

	public List<SignatureVO> getSignatures() {
		return signatures;
	}

	public void setSignatures(List<SignatureVO> signatures) {
		this.signatures = signatures;
	}

}
