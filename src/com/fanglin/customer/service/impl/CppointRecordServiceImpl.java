package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.service.CppointRecordService;
import com.fanglin.customer.vo.CppointRecordVO;
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Paging;

@Service("cppointRecordService")
@Transactional(readOnly = true)
public class CppointRecordServiceImpl implements CppointRecordService {

	@Autowired
	private CppointRecordDao cppointRecordDao;

	public void queryCppointRecord(CppointVO cppointVO, Paging paging, List<Filter> filters) {

		List<CppointRecordPO> cppointRecordPOs = cppointRecordDao.queryCppointRecord(cppointVO.getCpid(), paging, filters);
		List<CppointRecordVO> cppointRecordVOs = new ArrayList<CppointRecordVO>();

		for (CppointRecordPO cppointRecordPO : cppointRecordPOs) {
			cppointRecordVOs.add(cppointRecordPO.ptv(new CppointRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		paging.setData(cppointRecordVOs);
	}

}
