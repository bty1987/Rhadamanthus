package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EcaseDao;
import com.fanglin.market.dao.EpersonDao;
import com.fanglin.market.po.EcasePO;
import com.fanglin.market.po.EpersonPO;
import com.fanglin.market.service.EcaseService;
import com.fanglin.market.vo.EcaseVO;
import com.fanglin.market.vo.EpersonVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ecaseService")
@Transactional(readOnly = true)
public class EcaseServiceImpl implements EcaseService {

	@Autowired
	private EcaseDao ecaseDao;

	@Autowired
	private EpersonDao euserDao;

	@Override
	public void pageEcase(Paging paging, List<Filter> filters) {

		List<EcasePO> ecasePOs = ecaseDao.pageEcase(paging, filters);
		List<EcaseVO> ecaseVOs = new ArrayList<EcaseVO>();

		for (EcasePO ecasePO : ecasePOs) {

			EcaseVO ecaseVO = new EcaseVO(new EpersonVO(), new EpersonVO());

			BeanUtil.copyPropertie(ecasePO, ecaseVO, Arrays.asList("designer", "supervisor"));
			BeanUtil.copyPropertie(ecasePO.getDesigner(), ecaseVO.getDesigner());
			BeanUtil.copyPropertie(ecasePO.getSupervisor(), ecaseVO.getSupervisor());

			ecaseVOs.add(ecaseVO);
		}

		paging.setData(ecaseVOs);
	}

	@Override
	public List<EcaseVO> queryEcase(EcaseVO ecaseVO) {

		List<EcasePO> ecasePOs = ecaseDao.queryEcase(ecaseVO.getCityId(), ecaseVO.getStatus(), ecaseVO.getType());
		List<EcaseVO> ecaseVOs = new ArrayList<EcaseVO>();

		for (EcasePO ecasePO : ecasePOs) {

			ecaseVO = new EcaseVO(new EpersonVO(), new EpersonVO());

			BeanUtil.copyPropertie(ecasePO, ecaseVO, Arrays.asList("designer", "supervisor"));
			BeanUtil.copyPropertie(ecasePO.getDesigner(), ecaseVO.getDesigner());
			BeanUtil.copyPropertie(ecasePO.getSupervisor(), ecaseVO.getSupervisor());

			ecaseVOs.add(ecaseVO);
		}

		return ecaseVOs;
	}

	@Override
	public EcaseVO queryEcaseByCid(EcaseVO ecaseVO) {

		EcasePO ecasePO = ecaseDao.get(ecaseVO.getCid());
		ecaseVO = new EcaseVO(new EpersonVO(), new EpersonVO());

		BeanUtil.copyPropertie(ecasePO, ecaseVO, Arrays.asList("designer", "supervisor"));
		BeanUtil.copyPropertie(ecasePO.getDesigner(), ecaseVO.getDesigner());
		BeanUtil.copyPropertie(ecasePO.getSupervisor(), ecaseVO.getSupervisor());

		return ecaseVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addEcase(EcaseVO ecaseVO) throws FLException {

		EcasePO ecasePO = new EcasePO();

		BeanUtil.copyProperties(ecaseVO, ecasePO, Arrays.asList("designer", "supervisor"));

		if (ecaseVO.getDesigner().getEuid() != null) {
			EpersonPO designer = euserDao.get(ecaseVO.getDesigner().getEuid());
			ecasePO.setDesigner(designer);
		}

		if (ecaseVO.getSupervisor().getEuid() != null) {
			EpersonPO supervisor = euserDao.get(ecaseVO.getSupervisor().getEuid());
			ecasePO.setSupervisor(supervisor);
		}

		ecaseDao.save(ecasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateEcase(EcaseVO ecaseVO) throws FLException {

		EcasePO ecasePO = this.ecaseDao.get(ecaseVO.getCid());

		if (ecasePO == null) return;

		BeanUtil.copyProperties(ecaseVO, ecasePO, Arrays.asList("cid", "designer", "supervisor", "status"));

		if (ecaseVO.getDesigner() != null && ecaseVO.getDesigner().getEuid() != null) {
			EpersonPO designerPO = euserDao.get(ecaseVO.getDesigner().getEuid());
			ecasePO.setDesigner(designerPO);
		}

		if (ecaseVO.getSupervisor() != null && ecaseVO.getSupervisor().getEuid() != null) {
			EpersonPO supervisorPO = euserDao.get(ecaseVO.getSupervisor().getEuid());
			ecasePO.setSupervisor(supervisorPO);
		}

		ecaseDao.update(ecasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateEcaseForStatus(EcaseVO ecaseVO) throws FLException {

		EcasePO ecasePO = this.ecaseDao.get(ecaseVO.getCid());

		if (ecasePO == null) return;

		ecasePO.setStatus(ecaseVO.getStatus());

		ecaseDao.update(ecasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteEcase(EcaseVO ecaseVO) throws FLException {

		EcasePO ecasePO = ecaseDao.get(ecaseVO.getCid());

		ecaseDao.delete(ecasePO);
	}

}
