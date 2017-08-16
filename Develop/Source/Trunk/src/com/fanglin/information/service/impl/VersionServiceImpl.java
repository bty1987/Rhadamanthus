package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VersionDao;
import com.fanglin.information.po.VersionPO;
import com.fanglin.information.service.VersionService;
import com.fanglin.information.vo.VersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("versionService")
@Transactional(readOnly = true)
public class VersionServiceImpl implements VersionService{
	
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
	public List<VersionVO> queryVersion(List<Filter> filters) {
		
		filters.add(new Filter("status",String.valueOf(VersionPO.STATUS_ENABLED_INT),"eq"));
		
		List<VersionPO> versionPOs = versionDao.queryVersion(filters);
		List<VersionVO> versionVOs = new ArrayList<VersionVO>();
		
		VersionVO versionVO;
		
		for(VersionPO versionPO : versionPOs){
			
			versionVO = new VersionVO();
			
			BeanUtil.copyProperties(versionPO, versionVO);
			
			versionVOs.add(versionVO);
		}
		
		return versionVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addVersion(VersionVO versionVO) throws FLException {
		
		VersionPO versionPO = versionDao.queryVersionByNo(versionVO.getNo());
		
		if(versionPO!=null){
			throw new FLException(300001, "版本已存在");
		}
		
		versionPO = new VersionPO();
		
		BeanUtil.copyProperties(versionVO, versionPO);
		
		versionPO.setStatus(VersionPO.STATUS_DISABLED_INT);
		
		versionDao.save(versionPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateVersion(VersionVO versionVO) throws FLException {
		
		
		VersionPO versionPO = versionDao.get(versionVO.getVid());
		
		if(versionPO == null){
			throw new FLException(300002,"版本不存在");
		}
		
		if(!versionPO.getNo().equals(versionVO.getNo())){
			
			VersionPO version = versionDao.queryVersionByNo(versionVO.getNo());
			
			if(version != null){
				throw new FLException(300001, "版本已存在");
			}
			
		}
		
		versionPO.setNo(versionVO.getNo());
		versionPO.setCreateTime(versionVO.getCreateTime());
		versionPO.setComment(versionVO.getComment());
		
		versionDao.update(versionPO);
		
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateVersionForStatus(VersionVO versionVO) throws FLException{
		
		VersionPO versionPO = versionDao.get(versionVO.getVid());
		
		if(versionPO == null){
			throw new FLException(300002,"版本不存在");
		}
		
		versionPO.setStatus(versionVO.getStatus());
		
		versionDao.update(versionPO);
		
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
