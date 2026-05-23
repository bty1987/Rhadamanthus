package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.RuotationDao;
import com.fanglin.quotation.dao.RuotationItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.RuotationItemPO;
import com.fanglin.quotation.po.RuotationPO;
import com.fanglin.quotation.service.RuotationItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.RuotationItemVO;
import com.fanglin.quotation.vo.RuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("ruotationItemService")
@Transactional(readOnly = true)
public class RuotationItemServiceImpl implements RuotationItemService{

	@Autowired
	public RuotationDao ruotationDao;

	@Autowired
	public QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	public RuotationItemDao ruotationItemDao;

	@Autowired
	public QuotationItemDao quotationItemDao;

	@Override
	public List<RuotationItemVO> queryRuotationItem(RuotationItemVO ruotationItemVO) throws FLException {

		List<RuotationItemPO> ruotationItemPOs = ruotationItemDao.queryRuotationItem(ruotationItemVO.getRuotation().getQrid(), ruotationItemVO.getQuotationFunctionArea().getQfaId());
		List<RuotationItemVO> ruotationItemVOs = new ArrayList<RuotationItemVO>();
		
		for (RuotationItemPO ruotationItemPO : ruotationItemPOs) {
			ruotationItemVOs.add(ruotationItemPO.ptv(new RuotationItemVO(new RuotationVO(), new QuotationFunctionAreaVO(), new QuotationItemVO())));
		}

		return ruotationItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public RuotationItemVO updateRuotationItem(RuotationItemVO ruotationItemVO, RuotationVO ruotationVO) throws FLException {

		RuotationItemPO ruotationItemPO = null;

		if (ruotationItemVO.getQriid() == null) {

			ruotationItemPO = new RuotationItemPO();

			RuotationPO ruotationPO = ruotationDao.get(ruotationItemVO.getRuotation().getQrid());

			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(ruotationItemVO.getQuotationFunctionArea().getQfaId());

			QuotationItemPO quotationItemPO = quotationItemDao.get(ruotationItemVO.getQuotationItem().getQiid());

			BeanUtil.copyProperties(ruotationItemVO, ruotationItemPO, Arrays.asList("ruotation", "quotationFunctionArea", "quotationItem"));

			ruotationItemPO.setRuotation(ruotationPO);
			ruotationItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
			ruotationItemPO.setQuotationItem(quotationItemPO);

			quotationItemDao.save(ruotationItemPO);

			ruotationItemVO.setQriid(ruotationItemPO.getQriid());
			
		} else {

			ruotationItemPO = ruotationItemDao.get(ruotationItemVO.getQriid());

			ruotationItemPO.setFormula(ruotationItemVO.getFormula());
			ruotationItemPO.setInitNum(ruotationItemVO.getInitNum());
			ruotationItemPO.setNum(ruotationItemVO.getNum());

			quotationItemDao.update(ruotationItemPO);
		}

		RuotationPO ruotationPO = ruotationDao.get(ruotationVO.getQrid());

		ruotationPO.setTotalPrice(ruotationVO.getTotalPrice());

		ruotationDao.update(ruotationPO);

		return ruotationItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRuotationItemForIndex(List<RuotationItemVO> ruotationItemVOs) throws FLException {

		for (RuotationItemVO ruotationItemVO : ruotationItemVOs) {
			ruotationItemDao.updateRuotationItemForIndex(ruotationItemVO.getQriid(), ruotationItemVO.getIndex());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRuotationItem(RuotationItemVO ruotationItemVO, RuotationVO ruotationVO) throws FLException {

		RuotationItemPO ruotationItemPO = ruotationItemDao.get(ruotationItemVO.getQriid());

		RuotationPO ruotationPO = ruotationDao.get(ruotationVO.getQrid());

		ruotationPO.setTotalPrice(ruotationVO.getTotalPrice());

		ruotationItemDao.delete(ruotationItemPO);

		ruotationDao.update(ruotationPO);

		return 0;
	}

}
