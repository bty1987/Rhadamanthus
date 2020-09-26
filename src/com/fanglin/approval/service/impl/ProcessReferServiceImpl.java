
package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ProcessReferDao;
import com.fanglin.approval.po.ProcessReferPO;
import com.fanglin.approval.service.ProcessReferService;
import com.fanglin.approval.vo.ProcessReferVO;
import com.fanglin.utils.BeanUtil;

@Service("processReferService")
@Transactional(readOnly = true)
public class ProcessReferServiceImpl implements ProcessReferService {

	@Autowired
	private ProcessReferDao processReferDao;

	@Override
	public List<ProcessReferVO> queryProcessRefer() {
		
		List<ProcessReferPO> processReferPOs = processReferDao.queryProcessRefer();
		List<ProcessReferVO> processReferVOs = new ArrayList<ProcessReferVO>();
		
		for(ProcessReferPO processReferPO: processReferPOs){
			ProcessReferVO processReferVO = new ProcessReferVO();
			BeanUtil.copyProperties(processReferPO, processReferVO);
			processReferVOs.add(processReferVO);
		}
		
		return processReferVOs;
	}

}
