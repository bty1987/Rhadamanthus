package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.service.CppointRecordService;
import com.fanglin.customer.vo.CppointRecordVO;
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("cppointRecordService")
@Transactional(readOnly = true)
public class CppointRecordServiceImpl implements CppointRecordService {

	@Autowired
	private CppointRecordDao cppointRecordDao;

	public List<CppointRecordVO> queryCppointRecord(CppointVO cppointVO) {

		List<CppointRecordPO> cppointRecordPOs = cppointRecordDao.queryCppointRecord(cppointVO.getCpid());
		List<CppointRecordVO> cppointRecordVOs = new ArrayList<CppointRecordVO>();

		for (CppointRecordPO cppointRecordPO : cppointRecordPOs) {

			CppointRecordVO cppointRecordVO = new CppointRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));

			BeanUtil.copyPropertie(cppointRecordPO, cppointRecordVO, Arrays.asList("operater"));
			BeanUtil.copyPropertie(cppointRecordPO.getOperater(), cppointRecordVO.getOperater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			cppointRecordVOs.add(cppointRecordVO);
		}

		return cppointRecordVOs;
	}

}
