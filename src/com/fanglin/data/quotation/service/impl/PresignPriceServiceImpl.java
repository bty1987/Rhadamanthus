package com.fanglin.data.quotation.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignPricePO;
import com.fanglin.data.quotation.dao.PresignPriceDao;
import com.fanglin.data.quotation.service.PresignPriceService;
import com.fanglin.data.quotation.vo.PresignPriceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("presignPriceService")
@Transactional(readOnly = true)
public class PresignPriceServiceImpl implements PresignPriceService {

	@Autowired
	private PresignPriceDao presignPriceDao;

	@Override
	public void pagePresignPrice(Paging paging, List<Filter> filters, PresignPriceVO presignPriceVO) {

		List<PresignPricePO> presignPricePOs = presignPriceDao.pagePresignPrice(paging, filters, presignPriceVO.getPpid(), presignPriceVO.getStatus());
		List<PresignPriceVO> presignPriceVOs = new ArrayList<PresignPriceVO>();

		for (PresignPricePO presignPricePO : presignPricePOs) {

			presignPriceVO = new PresignPriceVO();

			BeanUtil.copyPropertie(presignPricePO, presignPriceVO);

			presignPriceVOs.add(presignPriceVO);
		}

		paging.setData(presignPriceVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPresignPrice(PresignPriceVO presignPriceVO) {

		PresignPricePO presignPricePO = new PresignPricePO();

		BeanUtil.copyProperties(presignPriceVO, presignPricePO);

		presignPriceDao.save(presignPricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePresignPrice(PresignPriceVO presignPriceVO) throws FLException, ParseException {

		PresignPricePO presignPricePO = presignPriceDao.get(presignPriceVO.getPspid());

		BeanUtil.copyProperties(presignPriceVO, presignPricePO);

		presignPriceDao.update(presignPricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePresignPriceForStatus(PresignPriceVO presignPriceVO) throws FLException {

		PresignPricePO presignPricePO = presignPriceDao.get(presignPriceVO.getPspid());

		if (presignPricePO == null) {
			throw new FLException(130083, "预签价格不存在");
		}

		presignPricePO.setStatus(presignPriceVO.getStatus());

		presignPriceDao.update(presignPricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePresignPrice(PresignPriceVO presignPriceVO) {

		PresignPricePO presignPricePO = presignPriceDao.get(presignPriceVO.getPspid());

		presignPriceDao.delete(presignPricePO);

		return 0;
	}

}
