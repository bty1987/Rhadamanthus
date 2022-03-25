package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormpackItemPO;
import com.fanglin.data.quotation.dao.NormpackItemDao;
import com.fanglin.data.quotation.service.NormpackItemService;
import com.fanglin.data.quotation.vo.NormpackItemVO;
import com.fanglin.utils.BeanUtil;


@Service("normpackItemService")
@Transactional(readOnly = true)
public class NormpackItemServiceImpl implements NormpackItemService{
	
	@Autowired
	private NormpackItemDao normpackItemDao;

	@Override
	public List<NormpackItemVO> queryNormpackItem(NormpackItemVO normpackItemVO) {

		List<NormpackItemPO> normpackItemPOs = normpackItemDao.queryNormpackItem(normpackItemVO.getNpid());
		List<NormpackItemVO> normpackItemVOs = new ArrayList<NormpackItemVO>();
				
		for (NormpackItemPO normpackItemPO : normpackItemPOs) {
			
			NormpackItemVO normpackItem = new NormpackItemVO(new GoodsVO());
			
			BeanUtil.copyPropertie(normpackItemPO, normpackItem, Arrays.asList("goods"));
			BeanUtil.copyPropertie(normpackItemPO.getGoods(), normpackItem.getGoods(), Arrays.asList("accessoriesType"));
			
			normpackItemVOs.add(normpackItem);
		}
		
		return normpackItemVOs;
	
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormpackItem(NormpackItemVO normpackItemVO) {
		
		NormpackItemPO normpackItemPO = new NormpackItemPO(new GoodsPO());
		
		BeanUtil.copyPropertie(normpackItemVO, normpackItemPO, Arrays.asList("goods"));
		BeanUtil.copyProperties(normpackItemVO.getGoods(), normpackItemPO.getGoods(), Arrays.asList("accessoriesType"));
		
		normpackItemDao.save(normpackItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormpackItem(NormpackItemVO normpackItemVO) {

		NormpackItemPO normpackItemPO = normpackItemDao.get(normpackItemVO.getNpiid());
		
		if(normpackItemPO != null){
			
			normpackItemDao.delete(normpackItemPO);
		}		
		return 0;
	}
}
