package com.fanglin.right.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.right.dao.CrossCompanyRightDao;
import com.fanglin.right.po.CrossCompanyRightPO;
import com.fanglin.right.service.CrossCompanyRightService;
import com.fanglin.right.vo.CrossCompanyRightVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;

@Service("crossCompanyRightService")
@Transactional(readOnly = true)
public class CrossCompanyRightServiceImpl implements CrossCompanyRightService {

	@Autowired
	private CrossCompanyRightDao crossCompanyRightDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<Integer> queryCompanysForView(String userId, int company, String module) {

		List<Integer> companys = new ArrayList<Integer>();

		companys.add(company);

		CrossCompanyRightPO crossCompanyRightPO = crossCompanyRightDao.queryCrossCompanyRight(userId, module);

		if (crossCompanyRightPO != null && crossCompanyRightPO.getCids() != null && crossCompanyRightPO.getCids().length() > 0) {

			for (String cid : crossCompanyRightPO.getCids().split(",")) {

				try {
					int c = Integer.parseInt(cid.trim());
					if (!companys.contains(c)) companys.add(c);
				} catch (NumberFormatException e) {
					// cids 由保存链路生成, 脏值跳过
				}
			}
		}

		Collections.sort(companys);

		return companys;
	}

	@Override
	public List<CrossCompanyRightVO> queryCrossCompanyRightByUid(int uid) throws FLException {

		List<CrossCompanyRightVO> crossCompanyRightVOs = new ArrayList<CrossCompanyRightVO>();

		for (CrossCompanyRightPO crossCompanyRightPO : crossCompanyRightDao.queryCrossCompanyRight(uid)) {

			CrossCompanyRightVO crossCompanyRightVO = new CrossCompanyRightVO();

			crossCompanyRightVO.setUcrid(crossCompanyRightPO.getUcrid());
			crossCompanyRightVO.setUid(crossCompanyRightPO.getUid());
			crossCompanyRightVO.setModule(crossCompanyRightPO.getModule());
			crossCompanyRightVO.setCreateTime(crossCompanyRightPO.getCreateTime());

			crossCompanyRightVO.setCompanys(new ArrayList<CompanyVO>());

			List<Integer> cids = parseCids(crossCompanyRightPO.getCids());

			if (cids.size() > 0) {
				for (CompanyPO companyPO : companyDao.queryCompanyByIds(cids)) {
					crossCompanyRightVO.getCompanys().add(companyPO.ptv(new CompanyVO()));
				}
			}

			crossCompanyRightVOs.add(crossCompanyRightVO);
		}

		return crossCompanyRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCrossCompanyRight(int uid, List<CrossCompanyRightVO> crossCompanyRights, String userId) throws FLException {

		crossCompanyRightDao.deleteCrossCompanyRight(uid);

		UserPO operater = userDao.queryUserByUserId(userId);

		int cuid = operater == null ? 0 : operater.getUid();

		if (crossCompanyRights == null) return;

		for (CrossCompanyRightVO crossCompanyRightVO : crossCompanyRights) {

			if (crossCompanyRightVO == null || crossCompanyRightVO.getModule() == null || crossCompanyRightVO.getModule().length() == 0) continue;
			if (crossCompanyRightVO.getCids() == null || crossCompanyRightVO.getCids().size() == 0) continue;

			TreeSet<Integer> cids = new TreeSet<Integer>();

			for (String encrypt : crossCompanyRightVO.getCids()) {

				if (encrypt == null || encrypt.length() == 0) continue;

				cids.add(CompanyServiceImpl.decode(encrypt));
			}

			if (cids.size() == 0) continue;

			StringBuffer csv = new StringBuffer();

			for (Integer cid : cids) {
				csv.append(csv.length() == 0 ? "" : ",").append(cid);
			}

			CrossCompanyRightPO crossCompanyRightPO = new CrossCompanyRightPO(uid, crossCompanyRightVO.getModule(), csv.toString(), cuid);

			crossCompanyRightPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

			crossCompanyRightDao.addCrossCompanyRight(crossCompanyRightPO);
		}
	}

	private List<Integer> parseCids(String cids) {

		List<Integer> ints = new ArrayList<Integer>();

		if (cids == null || cids.length() == 0) return ints;

		for (String cid : cids.split(",")) {

			try {
				ints.add(Integer.parseInt(cid.trim()));
			} catch (NumberFormatException e) {
				// 脏值跳过
			}
		}

		return ints;
	}

}
