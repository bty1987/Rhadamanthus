package com.fanglin.upgrade.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.upgrade.dao.VersionDao;
import com.fanglin.upgrade.po.VersionPO;
import com.fanglin.upgrade.service.VersionService;
import com.fanglin.upgrade.vo.VersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("versionService")
@Transactional(readOnly = true)
public class VersionServiceImpl implements VersionService {

	@Autowired
	private VersionDao versionDao;
	
	@Override
	public void pageVersion(Paging paging, List<Filter> filters) {
		List<VersionPO> versionPOs = versionDao.pageVersion(paging, filters);
		List<VersionVO> versionVOs = new ArrayList<VersionVO>();
		
		VersionVO versionVO;
		
		for(VersionPO versionPO: versionPOs){
			
			versionVO = new VersionVO();
			
			BeanUtil.copyProperties(versionPO, versionVO);
			
			versionVOs.add(versionVO);
		}

		paging.setData(versionVOs);
		
	}

	@Override
	public List<VersionVO> queryVersion(List<Filter> filters,VersionVO versionVO) {

		List<VersionPO> versionPOs = versionDao.queryVersion(filters);
		List<VersionVO> versionVOs = new ArrayList<VersionVO>();
		
		for (VersionPO versionPO : versionPOs) {
			
			if(versionPO.getVersionNumber().compareTo(versionVO.getVersionNumber())>0){
				
				VersionVO version = new VersionVO();
				
				BeanUtil.copyProperties(versionPO, version);
				
				versionVOs.add(version);
			}
		}

		return versionVOs;
	}
	
	@Override
	public VersionVO matchVersion(VersionVO versionVO) {
		
		List<VersionPO> versionPOs = versionDao.matchVersion(versionVO.getTrialVersion());
		
		Collections.sort(versionPOs, new Comparator<VersionPO>() {
			@Override
			public int compare(VersionPO version1, VersionPO version2) {
				
				String versionNumber1 = version1.getVersionNumber();
				String versionNumber2 = version2.getVersionNumber();
				
				return versionNumber2.compareTo(versionNumber1);
			}
			
		});
		
		VersionPO versionPO = versionPOs.get(0);
		BeanUtil.copyProperties(versionPO, versionVO);
		
		return versionVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addVersion(VersionVO versionVO) throws FLException{
		
		List<VersionPO> versionPOs = versionDao.matchVersion(versionVO.getTrialVersion());
		
		for(VersionPO versionPO : versionPOs){
			
			if(versionPO.getVersionNumber().equals(versionVO.getVersionNumber()) && versionPO.getTrialVersion().equals(versionVO.getTrialVersion())){
				
				throw new FLException(300001, "版本已存在");
				
			}
			
		}
		
		VersionPO versionPO = new VersionPO();
		
		BeanUtil.copyProperties(versionVO, versionPO);
		
		versionDao.save(versionPO);
		
		return 0; 
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteVersion(VersionVO versionVO) throws FLException {
		
		VersionPO versionPO = versionDao.get(versionVO.getVid());
		
		if(versionPO == null){
			throw new FLException(300002,"版本不存在");
		}
		
		versionDao.delete(versionPO);
		
		return 0;
	}

}
