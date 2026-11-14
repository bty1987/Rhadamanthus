package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesFunctionDao;
import com.fanglin.sales.po.SalesFunctionPO;
import com.fanglin.sales.service.SalesFunctionService;
import com.fanglin.sales.vo.SalesFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("salesFunctionService")
@Transactional(readOnly = true)
public class SalesFunctionServiceImpl implements SalesFunctionService {

	@Autowired
	private SalesFunctionDao salesFunctionDao;

	@Override
	public List<SalesFunctionVO> querySalesFunction(SalesFunctionVO salesFunctionVO) {
		List<SalesFunctionPO> salesFunctionPOs = salesFunctionDao.querySalesFunction(salesFunctionVO.getType());
		List<SalesFunctionVO> salesFunctionVOs = new ArrayList<SalesFunctionVO>();

		for (SalesFunctionPO salesFunctionPO : salesFunctionPOs) {

			salesFunctionVO = new SalesFunctionVO();

			BeanUtil.copyPropertie(salesFunctionPO, salesFunctionVO);

			salesFunctionVOs.add(salesFunctionVO);
		}

		return salesFunctionVOs;
	}

	@Override
	public List<SalesFunctionVO> querySalesFunctionByName(SalesFunctionVO salesFunctionVO) {

		List<SalesFunctionPO> salesFunctionPOs = salesFunctionDao.querySalesFunctionByName(salesFunctionVO.getName());
		List<SalesFunctionVO> salesFunctionVOs = new ArrayList<SalesFunctionVO>();

		for (SalesFunctionPO salesFunctionPO : salesFunctionPOs) {

			salesFunctionVO = new SalesFunctionVO();

			BeanUtil.copyPropertie(salesFunctionPO, salesFunctionVO);

			salesFunctionVOs.add(salesFunctionVO);

		}

		return salesFunctionVOs;
	}

	@Override
	public List<SalesFunctionVO> pageSalesFunction(Paging paging, List<Filter> filters) {

		List<SalesFunctionPO> salesFunctionPOs = salesFunctionDao.pageSalesFunction(paging, filters);
		List<SalesFunctionVO> salesFunctionVOs = new ArrayList<SalesFunctionVO>();

		for (SalesFunctionPO salesFunctionPO : salesFunctionPOs) {

			SalesFunctionVO salesFunctionVO = new SalesFunctionVO();

			BeanUtil.copyPropertie(salesFunctionPO, salesFunctionVO);

			salesFunctionVOs.add(salesFunctionVO);
		}

		return salesFunctionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesFunction(SalesFunctionVO salesFunctionVO) throws FLException {

		if (salesFunctionDao.querySalesFunctionByName(salesFunctionVO.getName()).size() > 0) {
			throw new FLException(370034, "销售功能已存在");
		}

		SalesFunctionPO salesFunctionPO = new SalesFunctionPO();

		BeanUtil.copyPropertie(salesFunctionVO, salesFunctionPO);

		salesFunctionDao.save(salesFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesFunction(SalesFunctionVO salesFunctionVO) throws FLException {

		SalesFunctionPO salesFunctionPO = salesFunctionDao.get(salesFunctionVO.getSfid());

		if (salesFunctionPO == null) {
			throw new FLException(370036, "销售功能不存在");
		}

		for (SalesFunctionPO namePO : salesFunctionDao.querySalesFunctionByName(salesFunctionVO.getName())) {
			if (namePO.getSfid() != salesFunctionVO.getSfid().longValue()) {
				throw new FLException(370034, "销售功能已存在");
			}
		}

		BeanUtil.copyPropertie(salesFunctionVO, salesFunctionPO, Arrays.asList("sfid"));

		salesFunctionDao.update(salesFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSalesFunction(SalesFunctionVO salesFunctionVO) throws FLException {

		if (salesFunctionDao.countSalesFunctionRightBySfid(salesFunctionVO.getSfid()) > 0) {
			throw new FLException(370035, "销售功能已被引用,不可删除");
		}

		salesFunctionDao.deleteById(salesFunctionVO.getSfid());

		return 0;
	}

}
