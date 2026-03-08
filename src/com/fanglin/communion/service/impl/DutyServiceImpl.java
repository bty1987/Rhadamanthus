package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.service.DutyService;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("dutyService")
@Transactional(readOnly = true)
public class DutyServiceImpl implements DutyService {

	@Autowired
	private DutyDao dutyDao;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

	@Override
	public void pageDuty(Paging paging, List<Filter> filters) {

		List<DutyPO> dutyPOs = dutyDao.pageDuty(paging, filters);
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();

		for (DutyPO dutyPO : dutyPOs) {

			DutyVO dutyVO = new DutyVO(new DepartmentTypeVO());

			BeanUtil.copyProperties(dutyPO, dutyVO, Arrays.asList("departmentType"));

			BeanUtil.copyProperties(dutyPO.getDepartmentType(), dutyVO.getDepartmentType());

			dutyVOs.add(dutyVO);
		}

		paging.setData(dutyVOs);
	}

	@Override
	public List<DutyVO> queryDuty() {

		List<DutyPO> dutyPOs = dutyDao.queryDuty();
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();

		DutyVO dutyVO;

		for (DutyPO dutyPO : dutyPOs) {

			dutyVO = new DutyVO(new DepartmentTypeVO());

			BeanUtil.copyProperties(dutyPO, dutyVO, Arrays.asList("departmentType"));
			dutyVO.getDepartmentType().setDtid(dutyPO.getDepartmentType().getDtid());
			dutyVO.getDepartmentType().setName(dutyPO.getDepartmentType().getName());

			dutyVOs.add(dutyVO);
		}

		return dutyVOs;
	}

	@Override
	public List<DutyVO> queryDutyByName(String name, DutyVO dutyVO) {

		if (dutyVO == null) dutyVO = new DutyVO();

		Integer dtid = null;

		if (dutyVO.getDepartmentType() != null) dtid = dutyVO.getDepartmentType().getDtid();

		List<DutyPO> dutyPOs = dutyDao.pageDutyByName(new Paging(0, 10), name, dtid, dutyVO.getStatus());
		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();

		for (DutyPO dutyPO : dutyPOs) {

			dutyVO = new DutyVO(new DepartmentTypeVO());

			BeanUtil.copyProperties(dutyPO, dutyVO, Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(dutyPO.getDepartmentType(), dutyVO.getDepartmentType());

			dutyVOs.add(dutyVO);
		}

		return dutyVOs;
	}

	@Override
	public List<DutyVO> queryDutyByDtid(DutyVO dutyVO) {

		List<DutyVO> dutyVOs = new ArrayList<DutyVO>();

		if (dutyVO == null) return dutyVOs;

		if (dutyVO.getDepartmentType() == null) return dutyVOs;

		List<DutyPO> dutyPOs = dutyDao.queryDutyByDtid(dutyVO.getDepartmentType().getDtid());

		for (DutyPO dutyPO : dutyPOs) {

			dutyVO = new DutyVO(new DepartmentTypeVO());

			BeanUtil.copyProperties(dutyPO, dutyVO, Arrays.asList("departmentType"));

			if (dutyPO.getDepartmentType() != null) BeanUtil.copyProperties(dutyPO.getDepartmentType(), dutyVO.getDepartmentType());

			dutyVOs.add(dutyVO);
		}

		return dutyVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDuty(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.queryDutyByName(dutyVO.getName());

		if (dutyPO != null) {
			throw new FLException(130016, "职位已存在");
		}

		dutyPO = new DutyPO(new DepartmentTypePO());

		BeanUtil.copyProperties(dutyVO, dutyPO, Arrays.asList("departmentType"));
		BeanUtil.copyProperties(dutyVO.getDepartmentType(), dutyPO.getDepartmentType());

		dutyPO.setStatus(DutyPO.STATUS_INIT_INT);
		dutyPO.setPinYin(PinYin4Util.getPinyin(dutyVO.getName()).get(0));

		// 自动生成编号（如果用户未填写）
		if (dutyVO.getCode() == null || dutyVO.getCode().trim().isEmpty()) {
			dutyPO.setCode(generateDutyCode());
		} else {
			// 手动指定编号，检查唯一性
			DutyPO existingCode = dutyDao.queryDutyByCode(dutyVO.getCode());
			if (existingCode != null) {
				throw new FLException(130017, "编号已存在");
			}
			dutyPO.setCode(dutyVO.getCode().trim());
		}

		dutyDao.save(dutyPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDuty(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.get(dutyVO.getDid());

		if (dutyPO == null) {
			throw new FLException(130015, "职位不存在");
		}

		// 如果修改了编号，检查唯一性
		if (dutyVO.getCode() != null && !dutyVO.getCode().trim().isEmpty()) {
			String newCode = dutyVO.getCode().trim();
			if (!newCode.equals(dutyPO.getCode())) {
				DutyPO existingCode = dutyDao.queryDutyByCode(newCode);
				if (existingCode != null && existingCode.getDid() != dutyPO.getDid()) {
					throw new FLException(130017, "编号已存在");
				}
			}
		}

		DepartmentTypePO departmentTypePO = departmentTypeDao.get(dutyVO.getDepartmentType().getDtid());

		BeanUtil.copyProperties(dutyVO, dutyPO, Arrays.asList("departmentType", "status"));

		if (dutyVO.getCode() != null && !dutyVO.getCode().trim().isEmpty()) {
			dutyPO.setCode(dutyVO.getCode().trim());
		}

		dutyPO.setDepartmentType(departmentTypePO);

		dutyDao.update(dutyPO);

		return 0;
	}

	/**
	 * 自动生成岗位编号 规则：D + 3位数字（如：D001, D002...）
	 */
	private String generateDutyCode() {
		String maxCode = dutyDao.queryMaxDutyCode();

		if (maxCode == null || maxCode.isEmpty()) {
			return "D001";
		}

		try {
			// 提取数字部分并递增
			int num = Integer.parseInt(maxCode.substring(1));
			return String.format("D%03d", num + 1);
		} catch (Exception e) {
			// 如果解析失败，从头开始
			return "D001";
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDutyForStatus(DutyVO dutyVO) throws FLException {

		DutyPO dutyPO = dutyDao.get(dutyVO.getDid());

		if (dutyPO == null) {
			throw new FLException(130015, "职位不存在");
		}

		dutyPO.setStatus(dutyVO.getStatus());

		dutyDao.update(dutyPO);

		return 0;
	}

}
