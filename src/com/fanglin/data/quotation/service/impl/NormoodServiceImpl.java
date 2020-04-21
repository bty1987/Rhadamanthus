package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.NormoodDao;
import com.fanglin.data.quotation.service.NormoodService;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Service("normoodService")
@Transactional(readOnly = true)
public class NormoodServiceImpl implements NormoodService{

	@Autowired
	NormoodDao normoodDao;
	
	@Override
	public List<NormoodVO> queryNormoodByQiid(Long qiid) {
		
		List<NormoodPO> normoodPOs = normoodDao.queryNormoodByQiid(qiid);
		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();
		
		for (NormoodPO normoodPO : normoodPOs) {
			NormoodVO normoodVO = new NormoodVO(new GoodsVO(), new QuotationItemVO());
			
			BeanUtil.copyProperties(normoodPO, normoodVO,  Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(normoodPO.getGoods(), normoodVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(normoodPO.getQuotationItem(), normoodVO.getQuotationItem(), Arrays.asList(QuotationItemPO.COLUMN_ARRAYS_STR));
			
			normoodVOs.add(normoodVO);
		}
		
		return normoodVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addNormood(NormoodVO normoodVO) {
		
		NormoodPO normoodPO = new NormoodPO(new QuotationItemPO(), new GoodsPO());
		
		BeanUtil.copyProperties(normoodVO.getGoods(), normoodPO.getGoods(), Arrays.asList("accessoriesType"));
		BeanUtil.copyProperties(normoodVO.getQuotationItem(), normoodPO.getQuotationItem(), Arrays.asList(QuotationItemPO.COLUMN_ARRAYS_STR));
		
		normoodPO.setStatus(NormoodPO.STATUS_VALID_STR);
		normoodPO.setNum(normoodVO.getNum());
		
		normoodDao.save(normoodPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteNormood(NormoodVO normoodVO) {
		
		NormoodPO normoodPO = normoodDao.get(normoodVO.getNgid());
		
		normoodDao.deleteById(normoodPO.getNgid());
		
		return 0;
	}
}
