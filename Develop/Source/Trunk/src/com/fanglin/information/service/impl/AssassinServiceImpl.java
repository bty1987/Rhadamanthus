package com.fanglin.information.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.dao.AssassinDao;
import com.fanglin.information.po.AssassinPO;
import com.fanglin.information.service.AssassinService;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.LogUtils;


@Service("assassinService")
@Transactional(readOnly=true)
public class AssassinServiceImpl implements AssassinService {
	
	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private AssassinDao assassinDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	public int proxy(String server, String api, String params, String content, UserPO userPO) throws FLException {

		String communion = systemConfigDao.querySystemConfigByKey("communion").getValue();
		String code = systemConfigDao.querySystemConfigByKey("tokenkey").getValue();
		String secret = systemConfigDao.querySystemConfigByKey("tokensecret").getValue();
		
		server = systemConfigDao.querySystemConfigByKey(server).getValue();

		String str = String.format("%s/requestAuthCode.do?userId=%s&code=%s&secret=%s", communion, userPO.getUserId(), code, secret);
		JSONObject result  = HttpUtil.httpGet(str);

		String authentication;

		if(result != null && result.containsKey("authenticationEncode")){
			authentication = result.get("authenticationEncode").toString();
		}else{
			throw new FLException(110010, "请求失败");
		}
		
		String url = String.format("%s/%s?authentication=%s&%s",server, api, authentication, params);
		
		JSONObject results  = HttpUtil.httpGet(url);

		int errorCode = results.getInteger("errorCode");
		String errorMsg = results.getString("errorMsg");

		AssassinPO assassinPO = new AssassinPO();
		
		if(errorCode == 0){
			assassinPO.setApi(api);
			assassinPO.setContent(content);
			assassinPO.setServer(server);
			assassinPO.setErrorcode(errorCode);
			assassinPO.setErrormes("");
			assassinPO.setOperater(userPO);
			assassinPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			
			assassinDao.save(assassinPO);
		}else{
			LogUtils.logging(logger, server, results.getString("errorMsg"), api);
			throw new FLException(errorCode, errorMsg);
		}

		return 0;
	}
	
}
