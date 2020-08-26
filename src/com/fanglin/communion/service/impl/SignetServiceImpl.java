package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.SignetDao;
import com.fanglin.communion.po.SignetPO;
import com.fanglin.communion.service.SignetService;
import com.fanglin.communion.vo.SignetVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("signetService")
@Transactional(readOnly = true)
public class SignetServiceImpl implements SignetService {
	
	@Autowired
	private SignetDao signetDao;

	@Override
	public void pageSignet(Paging paging, List<Filter> filters, int company) {
		
		List<SignetPO> signetPOs = signetDao.pageSignet(paging, filters, company);
		List<SignetVO> signetVOs = new ArrayList<SignetVO>();
		
		for(SignetPO signetPO : signetPOs){
			SignetVO signetVO = new SignetVO();
			
			BeanUtil.copyProperties(signetPO, signetVO);
			
			signetVOs.add(signetVO);
		}
		
		paging.setData(signetVOs);
	}

	@Override
	public List<SignetVO> querySignet(int company) {
		
		List<SignetPO> signetPOs = signetDao.querySignet(company);
		List<SignetVO> signetVOs = new ArrayList<SignetVO>();
		
		for(SignetPO signetPO : signetPOs){
			SignetVO signetVO = new SignetVO();
			
			BeanUtil.copyProperties(signetPO, signetVO);
			
			signetVOs.add(signetVO);
		}
		
		return signetVOs;
	}

}
