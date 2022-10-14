/**
 * Title: OrganizationServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.OrganizationDao;
import com.fanglin.system.po.OrganizationPO;
import com.fanglin.system.service.OrganizationService;
import com.fanglin.system.vo.OrganizationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("organizationService")
@Transactional(readOnly = true)
public class OrganizationServiceImpl implements OrganizationService {

	@Autowired
	private OrganizationDao organizationDao;

	@Override
	public void pageOrganization(Paging paging, List<Filter> filters, Integer company) {

		List<OrganizationPO> organizationPOs = organizationDao.pageOrganization(paging, filters, company);
		List<OrganizationVO> organizationVOs = new ArrayList<OrganizationVO>();

		for (OrganizationPO organizationPO : organizationPOs) {

			OrganizationVO organizationVO = new OrganizationVO();

			BeanUtil.copyProperties(organizationPO, organizationVO);

			organizationVOs.add(organizationVO);
		}

		paging.setData(organizationVOs);
	}

	@Override
	public List<OrganizationVO> queryOrganization(OrganizationVO organizationVO, Integer company) {

		List<OrganizationPO> organizationPOs = organizationDao.queryOrganization(organizationVO.getName(), company);
		List<OrganizationVO> organizationVOs = new ArrayList<OrganizationVO>();

		for (OrganizationPO organizationPO : organizationPOs) {

			organizationVO = new OrganizationVO();

			BeanUtil.copyProperties(organizationPO, organizationVO);

			organizationVOs.add(organizationVO);
		}

		return organizationVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOrganization(OrganizationVO organization, Integer company) {

		OrganizationPO organizationPO = new OrganizationPO();

		BeanUtil.copyProperties(organization, organizationPO);

		organizationPO.setPinyin(PinYin4Util.getPinyin(organizationPO.getName()).get(0));
		organizationPO.setCompany(company);

		organizationDao.save(organizationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateOrganization(OrganizationVO organizationVO) throws FLException {

		OrganizationPO organizationPO = organizationDao.get(organizationVO.getOid());

		if (organizationPO == null) {
			throw new FLException(230026, "组织不存在");
		}

		organizationPO.setName(organizationVO.getName());
		organizationPO.setNo(organizationVO.getNo());
		organizationPO.setPinyin(PinYin4Util.getPinyin(organizationPO.getName()).get(0));

		organizationDao.update(organizationPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateOrganizationForStatus(OrganizationVO organizationVO) throws FLException {

		OrganizationPO organizationPO = organizationDao.get(organizationVO.getOid());

		if (organizationPO == null) {
			throw new FLException(230026, "组织不存在");
		}

		organizationPO.setStatus(organizationVO.getStatus());

		organizationDao.update(organizationPO);
	}

}
