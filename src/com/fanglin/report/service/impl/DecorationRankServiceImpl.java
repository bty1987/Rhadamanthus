/**
 * @File Name		: DecorationRankServiceImpl.java
 * @Package   	: com.fanglin.report.service.impl
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.TopVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.report.dao.DecorationDepartmentRankDao;
import com.fanglin.report.dao.DecorationRankDao;
import com.fanglin.report.dao.DecorationRegionRankDao;
import com.fanglin.report.po.DecorationDepartmentRankPO;
import com.fanglin.report.po.DecorationRankPO;
import com.fanglin.report.po.DecorationRegionRankPO;
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.report.vo.DecorationDepartmentRankVO;
import com.fanglin.report.vo.DecorationRankVO;
import com.fanglin.report.vo.DecorationRegionRankVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationRankService")
@Transactional(readOnly = true)
public class DecorationRankServiceImpl implements DecorationRankService {

	@Autowired
	private DecorationRankDao decorationRankDao;

	@Autowired
	private DecorationDepartmentRankDao decorationDepartmentRankDao;

	@Autowired
	private DecorationRegionRankDao decorationRegionRankDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DecorationRankVO> queryDecorationRankForTop(DecorationRankVO rank, int top, int company) {

		Integer month = Integer.parseInt(DateUtil.getDateToDateString(new Date(), "yyyyMM"));
		Integer duid = null;
		Integer ddid = null;
		Integer drid = null;
		Short type = rank.getType();

		if (rank.getMonth() != null) {
			month = rank.getMonth();
		}

		if (rank.getDesigner() != null && rank.getDesigner().getUserId() != "") {
			UserPO designer = userDao.queryUserByUserId(rank.getDesigner().getUserId());

			duid = designer.getUid();
		}

		if (rank.getDepte() != null) {
			ddid = rank.getDepte().getDid();
		}

		if (rank.getRegion() != null) {
			drid = rank.getRegion().getDid();
		}

		List<DecorationRankPO> decorationRankPOs = decorationRankDao.queryDecorationRankForTop(top, month, duid, ddid, drid, type, company);
		List<DecorationRankVO> decorationRankVOs = new ArrayList<DecorationRankVO>();

		for (DecorationRankPO decorationRankPO : decorationRankPOs) {
			DecorationRankVO decorationRankVO = new DecorationRankVO(new DepartmentVO(), new DepartmentVO(), new UserBaseVO());
			BeanUtil.copyProperties(decorationRankPO, decorationRankVO, Arrays.asList("region", "depte", "designer"));
			BeanUtil.copyPropertie(decorationRankPO.getRegion(), decorationRankVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(decorationRankPO.getDepte(), decorationRankVO.getDepte(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(decorationRankPO.getDesigner(), decorationRankVO.getDesigner(), Arrays.asList("duty", "dept"));
			decorationRankVOs.add(decorationRankVO);
		}

		return decorationRankVOs;
	}

	@Override
	public List<TopVO> queryDecorationRank(int top, int company) {

		int month = Integer.parseInt(DateUtil.getDateToDateString(new Date(), "yyyyMM"));

		List<DecorationRankPO> decorationRankPOs = decorationRankDao.queryDecorationRankForTop(top, month, null, null, null, null, company);
		List<TopVO> topVOs = new ArrayList<TopVO>();

		for (DecorationRankPO decorationRankPO : decorationRankPOs) {
			TopVO topVO = new TopVO();
			topVO.setTopName(decorationRankPO.getDesigner().getUserName());

			UserPO designer = userDao.queryUserByUserId(decorationRankPO.getDesigner().getUserId());
			if (designer != null) {
				topVO.setTopImg(designer.getUserPhoto());
			} else {
				topVO.setTopImg("");
			}
			topVO.setTopType("设计师主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(decorationRankPO.getRank())));
			// topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(decorationRankPO.getMonth(), DecorationRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");

			topVOs.add(topVO);
		}

		return topVOs;
	}

	@Override
	public List<DecorationDepartmentRankVO> queryDecorationDepartmentRankForTop(DecorationDepartmentRankVO rank, int top, int company) {

		Integer month = Integer.parseInt(DateUtil.getDateToDateString(new Date(), "yyyyMM"));
		Integer ddid = null;
		Integer drid = null;
		Short type = rank.getType();

		if (rank.getMonth() != null) {
			month = rank.getMonth();
		}

		if (rank.getDepte() != null) {
			ddid = rank.getDepte().getDid();
		}

		if (rank.getRegion() != null) {
			drid = rank.getRegion().getDid();
		}

		List<DecorationDepartmentRankPO> decorationDepartmentRankPOs = decorationDepartmentRankDao.queryDecorationDepartmentRankForTop(top, month, ddid, drid, type, company);
		List<DecorationDepartmentRankVO> decorationDepartmentRankVOs = new ArrayList<DecorationDepartmentRankVO>();

		for (DecorationDepartmentRankPO decorationDepartmentRankPO : decorationDepartmentRankPOs) {
			DecorationDepartmentRankVO decorationDepartmentRankVO = new DecorationDepartmentRankVO(new DepartmentVO(), new DepartmentVO());
			BeanUtil.copyProperties(decorationDepartmentRankPO, decorationDepartmentRankVO, Arrays.asList("region", "depte"));
			BeanUtil.copyPropertie(decorationDepartmentRankPO.getRegion(), decorationDepartmentRankVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(decorationDepartmentRankPO.getDepte(), decorationDepartmentRankVO.getDepte(), Arrays.asList("type", "fatherDept", "manager"));

			decorationDepartmentRankVOs.add(decorationDepartmentRankVO);
		}

		return decorationDepartmentRankVOs;
	}

	@Override
	public List<TopVO> queryDecorationDepartmentRank(int top, int company) {

		int month = Integer.parseInt(DateUtil.getDateToDateString(new Date(), "yyyyMM"));

		List<DecorationDepartmentRankPO> decorationDepartmentRankPOs = decorationDepartmentRankDao.queryDecorationDepartmentRankForTop(top, month, null, null, null, company);
		List<TopVO> topVOs = new ArrayList<TopVO>();

		for (DecorationDepartmentRankPO decorationDepartmentRankPO : decorationDepartmentRankPOs) {
			TopVO topVO = new TopVO();
			// topVO.setTopName(decorationDesignerDepartmentRankPO.getDesignerDeptName());
			topVO.setTopImg("");
			topVO.setTopType("设计部门主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(decorationDepartmentRankPO.getRank())));
			// topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(decorationDesignerDepartmentRankPO.getEndTime(), DecorationDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");

			topVOs.add(topVO);
		}

		return topVOs;
	}

	@Override
	public List<DecorationRegionRankVO> queryDecorationRegionRankForTop(DecorationRegionRankVO rank, int top, int company) {

		Integer month = Integer.parseInt(DateUtil.getDateToDateString(new Date(), "yyyyMM"));
		Integer drid = null;
		Short type = rank.getType();

		if (rank.getMonth() != null) {
			month = rank.getMonth();
		}

		if (rank.getRegion() != null) {
			drid = rank.getRegion().getDid();
		}

		List<DecorationRegionRankPO> decorationRegionRankPOs = decorationRegionRankDao.queryDecorationRegionRankForTop(top, month, drid, type, company);
		List<DecorationRegionRankVO> decorationRegionRankVOs = new ArrayList<DecorationRegionRankVO>();

		for (DecorationRegionRankPO decorationRegionRankPO : decorationRegionRankPOs) {
			DecorationRegionRankVO decorationRegionRankVO = new DecorationRegionRankVO(new DepartmentVO());
			BeanUtil.copyProperties(decorationRegionRankPO, decorationRegionRankVO, Arrays.asList("region"));
			BeanUtil.copyPropertie(decorationRegionRankPO.getRegion(), decorationRegionRankVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));

			decorationRegionRankVOs.add(decorationRegionRankVO);
		}

		return decorationRegionRankVOs;
	}

	@Override
	public List<TopVO> queryDecorationRegionRank(int top, int company) {

		int month = Integer.parseInt(DateUtil.getDateToDateString(new Date(), "yyyyMM"));

		List<DecorationRegionRankPO> decorationRegionRankPOs = decorationRegionRankDao.queryDecorationRegionRankForTop(top, month, null, null, company);
		List<TopVO> topVOs = new ArrayList<TopVO>();

		for (DecorationRegionRankPO decorationRegionRankPO : decorationRegionRankPOs) {
			TopVO topVO = new TopVO();
			// topVO.setTopName(decorationDesignerRegionRankPO.getDesignerRegionName());
			topVO.setTopImg("");
			topVO.setTopType("设计分区主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(decorationRegionRankPO.getRank())));
			// topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(decorationDesignerRegionRankPO.getEndTime(), DecorationDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");

			topVOs.add(topVO);
		}

		return topVOs;
	}

	@Override
	public List<String> queryDecorationForPlaceByUserId(String userId, int company) {

		List<String> result = Arrays.asList(new String[] { "0", "0" });

		List<?> _ = decorationRankDao.queryDecorationRankForPlaceByDesignerId(userId, company);

		if (_.size() > 0) {

			Object[] infos = (Object[]) _.get(0);

			result.set(0, infos[0].toString());
			result.set(1, infos[1].toString());
		}

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationRank(String designerId, String designerName, long count, String currentTime, int company) {

		DecorationRankPO decorationRankPO = decorationRankDao.queryDecorationRankForInitByDesignerId(designerId, company);
		if (decorationRankPO != null) {
			decorationRankPO.setRank(Arith.add(decorationRankPO.getRank(), count));
		} else {
			decorationRankPO = new DecorationRankPO();
			// decorationDesignerRankPO.setCreateTime(currentTime);
			// decorationDesignerRankPO.setEndTime(currentTime);
			// decorationDesignerRankPO.setDesignerId(designerId);
			// decorationDesignerRankPO.setDesignerName(designerName);
			decorationRankPO.setRank(count);
			decorationRankPO.setCompany(company);
		}
		decorationRankDao.saveOrUpdate(decorationRankPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationDepartmentRank(String departmentId, String departmentName, long count, String currentTime, int company) {

		DecorationDepartmentRankPO decorationDepartmentRankPO = decorationDepartmentRankDao.queryDecorationDepartmentRankForInitByDeptId(departmentId, company);
		if (decorationDepartmentRankPO != null) {
			decorationDepartmentRankPO.setRank(Arith.add(decorationDepartmentRankPO.getRank(), count));
		} else {
			decorationDepartmentRankPO = new DecorationDepartmentRankPO();
			// decorationDesignerDepartmentRankPO.setCreateTime(currentTime);
			// decorationDesignerDepartmentRankPO.setEndTime(currentTime);
			// decorationDesignerDepartmentRankPO.setDesignerDeptId(departmentId);
			// decorationDesignerDepartmentRankPO.setDesignerDeptName(departmentName);
			decorationDepartmentRankPO.setRank(count);
			decorationDepartmentRankPO.setCompany(company);
		}
		decorationDepartmentRankDao.saveOrUpdate(decorationDepartmentRankPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationRegionRank(String regionId, String regionName, long count, String currentTime, int company) {

		DecorationRegionRankPO decorationRegionRankPO = decorationRegionRankDao.queryDecorationRegionRankForInitByRegionId(regionId, company);
		if (decorationRegionRankPO != null) {
			decorationRegionRankPO.setRank(Arith.add(decorationRegionRankPO.getRank(), count));
		} else {
			decorationRegionRankPO = new DecorationRegionRankPO();
			// decorationDesignerRegionRankPO.setCreateTime(currentTime);
			// decorationDesignerRegionRankPO.setEndTime(currentTime);
			// decorationDesignerRegionRankPO.setDesignerRegionId(regionId);
			// decorationDesignerRegionRankPO.setDesignerRegionName(regionName);
			decorationRegionRankPO.setRank(count);
			decorationRegionRankPO.setCompany(company);
		}
		decorationRegionRankDao.saveOrUpdate(decorationRegionRankPO);

		return 0;
	}

}
