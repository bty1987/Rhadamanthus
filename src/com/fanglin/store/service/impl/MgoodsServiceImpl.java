package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MbrandDao;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.po.MbrandPO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.service.MgoodsService;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.store.vo.McategoryVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("mgoodsService")
@Transactional(readOnly = true)
public class MgoodsServiceImpl implements MgoodsService {
	
	@Autowired
	private MgoodsDao mgoodsDao;
	
	@Autowired
	private MbrandDao mbrandDao;

	@Override
	public void pageMgoods(Paging paging, List<Filter> filters, boolean flag) {

		List<MgoodsPO> mgoodsPOs = mgoodsDao.pageMgoods(paging, filters, flag);
		List<MgoodsVO> mgoodsVOs = new ArrayList<MgoodsVO>();
		
		for (MgoodsPO mgoodsPO : mgoodsPOs) {
			mgoodsVOs.add(mgoodsPOToVO(mgoodsPO));
		}
		
		paging.setData(mgoodsVOs);
		
	}

	@Override
	public List<MgoodsVO> queryMgoodsByPinyin(MgoodsVO mgoodsVO) {
		Paging paging = new Paging(0, 10);
		List<MgoodsPO> mgoodsPOs = mgoodsDao.queryMgoodsByPinyin(paging, mgoodsVO.getPinyin());
		List<MgoodsVO> mgoodsVOs = new ArrayList<MgoodsVO>();
		
		for (MgoodsPO mgoodsPO : mgoodsPOs) {
			mgoodsVOs.add(mgoodsPOToVO(mgoodsPO));
		}
		
		return mgoodsVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMgoods(MgoodsVO mgoodsVO){
		
		MbrandPO mbrandPO = mbrandDao.get(mgoodsVO.getMbrand().getBid());
		
		MgoodsPO mgoodsPO = new MgoodsPO(mbrandPO);
		
		BeanUtil.copyProperties(mgoodsVO, mgoodsPO, Arrays.asList("mbrand", "pinyin"));
		
		List<String> pinyins = PinYin4Util.getPinyin(mgoodsVO.getName());
	    
		mgoodsPO.setPinyin((String)pinyins.get(0));
		
		mgoodsDao.save(mgoodsPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMgoods(MgoodsVO mgoodsVO) throws FLException {
		
		MgoodsPO mgoodsPO = mgoodsDao.get(mgoodsVO.getGid());
		
		if(mgoodsPO == null){
			throw new FLException(340005, "商品不存在");
		}
		
		BeanUtil.copyProperties(mgoodsVO, mgoodsPO, Arrays.asList("mbrand", "status"));
		
		mgoodsDao.update(mgoodsPO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMgoodsForStatus(MgoodsVO mgoodsVO) throws FLException {
		
		MgoodsPO mgoodsPO = mgoodsDao.get(mgoodsVO.getGid());
		
		if(mgoodsPO == null){
			throw new FLException(340005, "商品不存在");
		}
		
		mgoodsPO.setStatus(mgoodsVO.getStatus());
		
		mgoodsDao.update(mgoodsPO);

	}
	
	public MgoodsVO mgoodsPOToVO(MgoodsPO mgoodsPO){
		
		MgoodsVO mgoodsVO = new MgoodsVO(new MbrandVO(new McategoryVO()));
		
		BeanUtil.copyProperties(mgoodsPO, mgoodsVO, Arrays.asList("mbrand"));
		
		BeanUtil.copyProperties(mgoodsPO.getMbrand(), mgoodsVO.getMbrand(), Arrays.asList("mcategory"));
		
		BeanUtil.copyProperties(mgoodsPO.getMbrand().getMcategory(), mgoodsVO.getMbrand().getMcategory());
		
		return mgoodsVO;
	}
	
}
