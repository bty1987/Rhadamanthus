package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.market.dao.EcustomerDao;
import com.fanglin.market.po.EcustomerPO;
import com.fanglin.market.service.EcustomerService;
import com.fanglin.market.vo.EcustomerVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("ecustomerService")
@Transactional(readOnly = true)
public class EcustomerServiceImpl implements EcustomerService {

	@Autowired
	private EcustomerDao ecustomerDao;
	
	@Autowired
	private MessageService messageDDService;
	
	@Override
	public void pageEcustomer(Paging paging, List<Filter> filters) {
		
		List<EcustomerPO> ecustomerPOs = ecustomerDao.pageEcustomer(paging, filters);
	    List<EcustomerVO> ecustomerVOs = new ArrayList<EcustomerVO>();

	    for (EcustomerPO ecustomerPO : ecustomerPOs) {
	    	
	    	EcustomerVO ecustomerVO = new EcustomerVO();
	    	
	    	BeanUtil.copyPropertie(ecustomerPO, ecustomerVO);
	    	
	    	ecustomerVOs.add(ecustomerVO);
	    }

	    paging.setData(ecustomerVOs);

	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addEcustomer(EcustomerVO ecustomerVO, String securityCode, String verifyCode) throws FLException {
		
		EcustomerPO ecustomerPO = new EcustomerPO();
		
		if ((securityCode != null || "".equals(securityCode)) && (verifyCode != null || "".equals(verifyCode))) {		
			try {
				if (!verifyCode.equals(AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
					throw new FLException(330010, "报名失败,验证码错误");
				}
			} catch (Exception e) {
				throw new FLException(330010, "报名失败,验证码错误");
			}
		}
		
		BeanUtil.copyProperties(ecustomerVO, ecustomerPO);
		
		List<String> message = new ArrayList<String>();
		
		if (ecustomerPO.getName() != null && !"".equals(ecustomerPO.getName())) {
			message.add(String.format("姓名: %s", ecustomerPO.getName()));
		}
		if (ecustomerPO.getPhone() != null && !"".equals(ecustomerPO.getPhone())) {
			message.add(String.format("电话: %s", ecustomerPO.getPhone()));
		}
		if (ecustomerPO.getVillageName() != null && !" ".equals(ecustomerPO.getVillageName())) {
			message.add(String.format("楼盘: %s", ecustomerPO.getVillageName()));
		}
		
		messageDDService.sendMessage("71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3", StringUtils.join(message, ","));
		
		ecustomerDao.save(ecustomerPO);
	}

}
