package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationActivityRecordVO;

public interface DecorationActivityRecordService {

	public List<DecorationActivityRecordVO> queryDecorationActivityRecord(DecorationActivityRecordVO decorationActivityRecordVO) throws FLException;

	public int addDecorationActivityRecord(DecorationActivityRecordVO decorationActivityRecordVO, String userId) throws FLException;

}
