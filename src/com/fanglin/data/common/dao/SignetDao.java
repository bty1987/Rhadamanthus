package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SignetPO;
import com.fanglin.utils.Paging;

public interface SignetDao extends Dao<SignetPO> {

	public List<SignetPO> pageSignet(Paging paging, List<Filter> filters, int company);

	public List<SignetPO> querySignet(Short type, int company);

	public int countSignet(String no);

	public SignetPO querySignetByToken(String token);

}
