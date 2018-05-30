package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MformatDao;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.po.MformatPO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.service.MformatService;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.store.vo.McategoryVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.utils.BeanUtil;

@Service("mformatService")
@Transactional(readOnly = true)
public class MformatServiceImpl implements MformatService {

	@Autowired
	private MformatDao mformatDao;

	@Autowired
	private MgoodsDao mgoodsDao;

	@Override
	public List<MformatVO> queryMformatByGid(MformatVO mformatVO) {

		List<MformatPO> mformatPOs = mformatDao.queryMformatByGid(mformatVO.getMgoods().getGid(), false);
		
		List<MformatVO> mformatVOs = new ArrayList<MformatVO>();

		MformatVO mformat;
		
		for (MformatPO mformatPO : mformatPOs) {

			mformat = new MformatVO(new MgoodsVO(new MbrandVO(new McategoryVO())));
			
			mformatVOs.add(mformatPOToVO(mformatPO, mformat));
			
		}
		
		return mformatVOs;
		
	}
	
	@Override
	public List<MformatVO> queryMformatByGidAndStatus(MformatVO mformatVO) {

		List<MformatPO> mformatPOs = mformatDao.queryMformatByGid(mformatVO.getMgoods().getGid(), true);
		
		List<MformatVO> mformatVOs = new ArrayList<MformatVO>();

		MformatVO mformat;
		
		for (MformatPO mformatPO : mformatPOs) {

			mformat = new MformatVO(new MgoodsVO(new MbrandVO(new McategoryVO())));
		
			mformatVOs.add(mformatPOToVO(mformatPO, mformat));
			
		}
		
		return mformatVOs;
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMformat(MformatVO mformatVO) throws FLException {

		List<MformatPO> mformats = mformatDao.queryMformatByGid(mformatVO.getMgoods().getGid(), false);

		for (MformatPO mformatPO : mformats) {
			if(mformatPO.getFormat().equals(mformatVO.getFormat())){
				throw new FLException(260035, "规格已存在");
			}
		}

		MgoodsPO mgoods = mgoodsDao.get(mformatVO.getMgoods().getGid());
		
		MformatPO mformatPO = new MformatPO(mgoods);
		
		BeanUtil.copyPropertie(mformatVO, mformatPO, Arrays.asList("mgoods"));

		mformatDao.save(mformatPO);
	
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMformat(MformatVO mformatVO) throws FLException {

		MformatPO mformatPO = mformatDao.get(mformatVO.getFid());
		
		if (mformatPO == null) {
			throw new FLException(260015, "规格不存在");
		}

		mformatPO.setFormat(mformatVO.getFormat());
			
		mformatDao.update(mformatPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMformatForStatus(MformatVO mformatVO) throws FLException {

		MformatPO mformatPO = mformatDao.get(mformatVO.getFid());
		
		if (mformatPO == null) {
			throw new FLException(260015, "规格不存在");
		}

		mformatPO.setStatus(mformatVO.getStatus());
		
		mformatDao.update(mformatPO);

	}
	
	public MformatVO mformatPOToVO(MformatPO mformatPO, MformatVO mformat){
		
		mformat = new MformatVO(new MgoodsVO(new MbrandVO(new McategoryVO())));
		
		BeanUtil.copyPropertie(mformatPO, mformat, Arrays.asList("mgoods"));

		BeanUtil.copyPropertie(mformatPO.getMgoods(), mformat.getMgoods(), Arrays.asList("mbrand"));

		BeanUtil.copyPropertie(mformatPO.getMgoods().getMbrand(), mformat.getMgoods().getMbrand(), Arrays.asList("mcategory"));
		
		return mformat;
		
	}

}
