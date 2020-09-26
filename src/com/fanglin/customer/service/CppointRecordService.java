package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.CppointRecordVO;
import com.fanglin.customer.vo.CppointVO;

public interface CppointRecordService {

	public List<CppointRecordVO> queryCppointRecord(CppointVO cppointVO);

}
