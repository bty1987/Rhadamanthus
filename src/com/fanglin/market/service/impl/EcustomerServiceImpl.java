package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.market.dao.EcustomerDao;
import com.fanglin.market.po.EcustomerPO;
import com.fanglin.market.service.EcustomerService;
import com.fanglin.market.vo.EcustomerVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

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
	public void addEcustomer(EcustomerVO ecustomerVO) throws FLException {
		
		EcustomerPO ecustomerPO = new EcustomerPO();
		
		BeanUtil.copyProperties(ecustomerVO, ecustomerPO);
		
		messageDDService.sendMessage("71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3", String.format("姓名: %s,楼盘地址: %s.", ecustomerPO.getName(), ecustomerPO.getVillageName()));
		
		ecustomerDao.save(ecustomerPO);
	}

}
