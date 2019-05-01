/**
 * @File Name		: VactivityServiceImpl.java
 * @Package   	: com.fanglin.information.service.impl
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VactivityDao;
import com.fanglin.information.po.VactivityPO;
import com.fanglin.information.service.VactivityService;
import com.fanglin.information.vo.VactivityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vactivityService")
@Transactional(readOnly=true)
public class VactivityServiceImpl implements VactivityService {
	
	@Autowired
	private VactivityDao vactivityDao;

	@Override
	public void pageVactivity(Paging paging, List<Filter> filters) {
		
		List<VactivityPO> vactivityPOs = vactivityDao.pageVactivity(paging, filters);
		List<VactivityVO> vactivityVOs = new ArrayList<VactivityVO>();
		
		VactivityVO vactivityVO;
		
		for(VactivityPO vactivityPO: vactivityPOs){
			
			vactivityVO = new VactivityVO();
			
			BeanUtil.copyPropertie(vactivityPO, vactivityVO);
			
			vactivityVOs.add(vactivityVO);
		}
		
		paging.setData(vactivityVOs);
	}

	@Override
	public List<VactivityVO> queryVactivity() {
		
		List<VactivityPO> vactivityPOs = vactivityDao.queryVactivity();
		List<VactivityVO> vactivityVOs = new ArrayList<VactivityVO>();
		
		VactivityVO vactivityVO;
		
		for(VactivityPO vactivityPO: vactivityPOs){
			
			vactivityVO = new VactivityVO();
			
			BeanUtil.copyPropertie(vactivityPO, vactivityVO);
			
			vactivityVOs.add(vactivityVO);
		}
		
		return vactivityVOs;
	}

}
