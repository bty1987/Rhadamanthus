package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.store.dao.MorderItemDao;
import com.fanglin.store.po.MorderItemPO;
import com.fanglin.store.service.MorderItemService;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.utils.BeanUtil;


@Service("morderItemService")
@Transactional(readOnly=true)
public class MorderItemServiceImpl implements MorderItemService{
	
	@Autowired
	private MorderItemDao morderItemDao;
	
	@Override
	public List<MorderItemVO> queryMorderItemByOid(MorderVO orderVO) {
		
		List<MorderItemPO> morderItemPOs = morderItemDao.queryMorderItemByOid(orderVO.getOid());
		
		List<MorderItemVO> morderItemVOs = new ArrayList<MorderItemVO>();
		MorderItemVO morderItemVO;
		
		for (MorderItemPO morderItemPO : morderItemPOs) {
			
			morderItemVO = new MorderItemVO(new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
			
			BeanUtil.copyProperties(morderItemPO, morderItemVO, Arrays.asList("mprice"));
			BeanUtil.copyProperties(morderItemPO.getMprice(), morderItemVO.getMprice(), Arrays.asList("mgoods", "mcolor", "mformat"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMgoods(), morderItemVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMcolor(), morderItemVO.getMprice().getMcolor());
			BeanUtil.copyProperties(morderItemPO.getMprice().getMformat(), morderItemVO.getMprice().getMformat());

			morderItemVOs.add(morderItemVO);
		}
		
		return morderItemVOs;
	}
	
}
