package com.fanglin.factory.action;

import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.factory.service.ServerService;
import com.fanglin.factory.vo.ServerVO;
import com.fanglin.personel.service.MacontrolService;
import com.fanglin.personel.vo.MacontrolVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FactoryAction extends BaseListAction {

	private static final long serialVersionUID = -8303737529580504582L;

	@Autowired
	private ServerService serverService;

	@Autowired
	private MacontrolService macontrolService;

	private UserVO user;

	private List<ServerVO> servers;

	private List<MacontrolVO> macontrols;

	@Action(value = "queryServer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServer() {

		try {
			servers = serverService.queryServer(user);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");
		}

		return SUCCESS;
	}

	@Action(value = "checkMacontrol", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkMacontrol() throws FLException {

		try {
			macontrolService.checkMacontrol(user.getUserId(), macontrols);
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");
		}

		return SUCCESS;
	}

	@Action(value = "checkLicense", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkLicense() throws FLException {

		try {

			String licenseNO = request.getParameter("licenseNO");
			String licenseSN = request.getParameter("licenseSN");

			String encrypt = AESHelper.decrypt(licenseSN, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			if (encrypt.split("-").length != 3) {
				throw new FLException(110035, "验证信息错误1");
			}

			String no = encrypt.split("-")[0];
			Long timestamp = Long.parseLong(encrypt.split("-")[1]);
			Long timerange = Long.parseLong(encrypt.split("-")[2]);

			if (!licenseNO.equals(no)) {
				throw new FLException(110036, "验证信息错误2");
			}

			if (new Date().getTime() - timestamp > timerange) {
				throw new FLException(110037, "验证信息错误3");
			}

		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统繁忙,请稍后重试");
		}

		return SUCCESS;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public List<ServerVO> getServers() {
		return servers;
	}

	public void setServers(List<ServerVO> servers) {
		this.servers = servers;
	}

	public List<MacontrolVO> getMacontrols() {
		return macontrols;
	}

	public void setMacontrols(List<MacontrolVO> macontrols) {
		this.macontrols = macontrols;
	}

}
