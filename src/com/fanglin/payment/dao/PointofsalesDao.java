package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.PointofsalesPO;
import com.fanglin.utils.Paging;

public interface PointofsalesDao extends Dao<PointofsalesPO> {

	public List<PointofsalesPO> pagePointofsales(Paging paging, List<Filter> filters);

	public List<PointofsalesPO> queryPointofsales(String pid, Short type, Long rid);
	
	//这里接口原本没有rid, 是后增加的, 应该是根据当前收据对应的推送信息更新而不是全部更新
	public void updatePointofsales(List<Long> posids, Long rid, Short status, Short type);

	public long countPointofsales(String sn, Short status);
	
	public int countPointofsalesByPosids(List<Long> posids);

}
