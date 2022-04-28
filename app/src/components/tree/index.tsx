import React from "react";
import $ from "jquery";
import "./style.css";
import { useEffect } from "react";

export type Node = {
  name: string;
  children: Node[];
};

type TreeProps = {
  name: string;
  data: Node;
};

export const Tree = (props: TreeProps) => {
  const { data } = props;
  useEffect(() => {
    $(".genealogy-tree ul").show();
    $(".genealogy-tree>ul").show();
    $(".genealogy-tree ul.active").show();
    $(".genealogy-tree li").on("click", click);
    return () => {
      $(".genealogy-tree li").off("click", click);
    };
  }, []);

  function click(this: any, e: JQuery.ClickEvent) {
    var children = $(this).find("> ul");
    if (children.is(":visible")) children.hide("fast").removeClass("active");
    else children.show("fast").addClass("active");
    e.stopPropagation();
  }

  return (
    <div className="genealogy-body genealogy-scroll">
      <div className="genealogy-tree">
        <ul>
          <TreeNode {...data} />
        </ul>
      </div>
    </div>
  );
};

function TreeNode({ name, children }: Node) {
  return (
    <li>
      <div className="a">
        <div className="member-view-box">
          <div className="member-image">
            <img
              src="https://www.arweave.net/DmTrgodBFcLIy0Rl4Am28nihpoH4J0N_EgK6GelPezM?ext=png"
              alt="Member"
            />
            <div className="member-details">
              <a href="//wesy.club">
                <h3>{name}</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
      {children.length > 0 && (
        <ul>
          {children.map((item) => {
            return (
              <TreeNode
                key={item.name}
                name={item.name}
                children={item.children}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}
