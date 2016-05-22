package com.fanglin.system.vo;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;

public class ZNodeVO implements Serializable{

	private static final long serialVersionUID = 11111111L;
	
	@SerializedName("编号")
	private int id;
	
	@SerializedName("名称")
	private String name;
	
	private String checked;
	
	private String open;
	
	private String nocheck;
	
	private String chkDisabled;
	
	List<ZNodeVO> children;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}

	public String getChecked(){
		return checked;
	}

	public void setChecked(String checked){
		this.checked = checked;
	}

	public String getOpen(){
		return open;
	}

	public void setOpen(String open){
		this.open = open;
	}

	public List<ZNodeVO> getChildren(){
		return children;
	}

	public void setChildren(List<ZNodeVO> children){
		this.children = children;
	}

	public String getNocheck(){
		return nocheck;
	}

	public void setNocheck(String nocheck){
		this.nocheck = nocheck;
	}

	public String getChkDisabled(){
		return chkDisabled;
	}

	public void setChkDisabled(String chkDisabled){
		this.chkDisabled = chkDisabled;
	}
	
}
