package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.common.service.DecorationBusitypeService;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationBusitypeService")
@Transactional(readOnly = true)
public class DecorationBusitypeServiceImpl implements DecorationBusitypeService {

	@Autowired
	private DecorationBusitypeDao decorationBusitypeDao;

	@Override
	public void pageDecorationBusitype(Paging paging, List<Filter> filters, int company) {

		List<DecorationBusitypePO> decorationBusitypePOs = decorationBusitypeDao.pageDecorationBusitype(paging, filters, company);
		List<DecorationBusitypeVO> decorationBusitypeVOs = new ArrayList<DecorationBusitypeVO>();

		for (DecorationBusitypePO decorationBusitypePO : decorationBusitypePOs) {
			decorationBusitypeVOs.add(decorationBusitypePO.ptv(new DecorationBusitypeVO(new DecorationBusitypeVO())));
		}

		paging.setData(decorationBusitypeVOs);
	}

	@Override
	public List<DecorationBusitypeVO> queryDecorationBusitype(int company) {

		List<DecorationBusitypePO> decorationBusitypePOs = decorationBusitypeDao.queryDecorationBusitype(company);
		List<DecorationBusitypeVO> decorationBusitypeVOs = new ArrayList<DecorationBusitypeVO>();

		for (DecorationBusitypePO decorationBusitypePO : decorationBusitypePOs) {
			decorationBusitypeVOs.add(decorationBusitypePO.ptv(new DecorationBusitypeVO(new DecorationBusitypeVO())));
		}

		return decorationBusitypeVOs;
	}

	@Override
	public DecorationBusitypeVO queryDecorationBusitypeByName(DecorationBusitypeVO decorationBusitypeVO, String company) throws FLException {

		DecorationBusitypePO decorationBusitypePO = decorationBusitypeDao.queryDecorationBusitype(decorationBusitypeVO.getName(), CompanyServiceImpl.decode(company));

		if (decorationBusitypePO == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		decorationBusitypePO.ptv(decorationBusitypeVO);

		return decorationBusitypeVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationBusitype(DecorationBusitypeVO decorationBusitypeVO, int company) throws FLException {

		DecorationBusitypePO decorationBusitypePO = new DecorationBusitypePO();

		BeanUtil.copyPropertie(decorationBusitypeVO, decorationBusitypePO, Arrays.asList("cascade"));

		decorationBusitypePO.setStatus(DecorationBusitypePO.STATUS_ENABLE_INT);
		decorationBusitypePO.setCompany(company);

		decorationBusitypeDao.save(decorationBusitypePO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationBusitypeForStatus(DecorationBusitypeVO decorationBusitypeVO) throws FLException {

		DecorationBusitypePO decorationBusitypePO = decorationBusitypeDao.get(decorationBusitypeVO.getDbid());

		if (decorationBusitypePO == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		decorationBusitypePO.setStatus(decorationBusitypeVO.getStatus());

		decorationBusitypeDao.update(decorationBusitypePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationBusitype(DecorationBusitypeVO decorationBusitypeVO) throws FLException {

		DecorationBusitypePO decorationBusitypePO = decorationBusitypeDao.get(decorationBusitypeVO.getDbid());

		if (decorationBusitypePO == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		BeanUtil.copyPropertie(decorationBusitypeVO, decorationBusitypePO, Arrays.asList("status"));

		decorationBusitypeDao.update(decorationBusitypePO);
	}

}
