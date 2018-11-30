package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MformatDao;
import com.fanglin.store.po.MformatPO;
import com.fanglin.store.service.MformatService;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.utils.BeanUtil;

@Service("mformatService")
@Transactional(readOnly = true)
public class MformatServiceImpl implements MformatService {

	@Autowired
	private MformatDao mformatDao;

	@Override
	public List<MformatVO> queryMformatByGid(MformatVO mformatVO) {

		List<MformatPO> mformatPOs = mformatDao.queryMformatByGid(mformatVO.getGid(), mformatVO.getStatus());
		
		List<MformatVO> mformatVOs = new ArrayList<MformatVO>();

		MformatVO mformat;
		
		for (MformatPO mformatPO : mformatPOs) {

			mformat = new MformatVO();
			
			BeanUtil.copyPropertie(mformatPO, mformat);
			
			mformatVOs.add(mformat);
			
		}
		
		return mformatVOs;
		
	}
	
	@Override
	public List<MformatVO> queryMformat(MformatVO mformatVO) {

		List<MformatPO> mformatPOs = mformatDao.queryMformatByGid(mformatVO.getGid(), MformatPO.STATUS_ABLE_SHORT);
		
		List<MformatVO> mformatVOs = new ArrayList<MformatVO>();

		MformatVO mformat;
		
		for (MformatPO mformatPO : mformatPOs) {

			mformat = new MformatVO();
		
			BeanUtil.copyPropertie(mformatPO, mformat);
			
			mformatVOs.add(mformat);
			
		}
		
		return mformatVOs;
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMformat(MformatVO mformatVO){
		
		MformatPO mformatPO = new MformatPO();
		
		BeanUtil.copyPropertie(mformatVO, mformatPO);

		mformatDao.save(mformatPO);
	
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMformatForStatus(MformatVO mformatVO) throws FLException {

		MformatPO mformatPO = mformatDao.get(mformatVO.getFid());
		
		if (mformatPO == null) {
			throw new FLException(340007, "规格不存在");
		}

		mformatPO.setStatus(mformatVO.getStatus());
		
		mformatDao.update(mformatPO);

	}
	

}
